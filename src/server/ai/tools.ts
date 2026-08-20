import { prisma } from '@/server/database';
import { logger } from '@/lib/logger';
import { ValidationError, ForbiddenError } from '@/types';

export interface ToolExecutionContext {
  userId: string;
  workspaceId: string;
}

export async function createProject(
  context: ToolExecutionContext,
  args: { name: string; description?: string }
) {
  try {
    // Verify workspace access
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: context.workspaceId,
          userId: context.userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenError('No access to workspace');
    }

    // Generate unique slug
    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const project = await prisma.project.create({
      data: {
        workspaceId: context.workspaceId,
        name: args.name,
        description: args.description,
        slug,
      },
    });

    logger.info('Tool: createProject executed', {
      projectId: project.id,
      userId: context.userId,
    });

    return {
      success: true,
      projectId: project.id,
      name: project.name,
      slug: project.slug,
    };
  } catch (error) {
    logger.error('Tool: createProject failed', error as Error);
    throw error;
  }
}

export async function createTask(
  context: ToolExecutionContext,
  args: {
    projectId: string;
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }
) {
  try {
    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: args.projectId,
        workspace: {
          members: {
            some: {
              userId: context.userId,
            },
          },
        },
      },
    });

    if (!project) {
      throw new ForbiddenError('No access to project');
    }

    const task = await prisma.task.create({
      data: {
        projectId: args.projectId,
        title: args.title,
        description: args.description,
        priority: args.priority || 'MEDIUM',
      },
    });

    logger.info('Tool: createTask executed', {
      taskId: task.id,
      userId: context.userId,
    });

    return {
      success: true,
      taskId: task.id,
      title: task.title,
      status: task.status,
    };
  } catch (error) {
    logger.error('Tool: createTask failed', error as Error);
    throw error;
  }
}

export async function listProjects(
  context: ToolExecutionContext,
  args: { limit?: number }
) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        workspaceId: context.workspaceId,
      },
      take: args.limit || 10,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
      })),
      count: projects.length,
    };
  } catch (error) {
    logger.error('Tool: listProjects failed', error as Error);
    throw error;
  }
}

export async function listTasks(
  context: ToolExecutionContext,
  args: { projectId?: string; limit?: number }
) {
  try {
    const tasks = await prisma.task.findMany({
      where: args.projectId
        ? {
            projectId: args.projectId,
            project: {
              workspace: {
                members: {
                  some: {
                    userId: context.userId,
                  },
                },
              },
            },
          }
        : {
            project: {
              workspaceId: context.workspaceId,
            },
          },
      take: args.limit || 20,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
      })),
      count: tasks.length,
    };
  } catch (error) {
    logger.error('Tool: listTasks failed', error as Error);
    throw error;
  }
}

export async function createForgeProject(
  context: ToolExecutionContext,
  args: { name: string; description?: string; template: string }
) {
  try {
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: context.workspaceId,
          userId: context.userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenError('No access to workspace');
    }

    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const project = await prisma.forgeProject.create({
      data: {
        workspaceId: context.workspaceId,
        name: args.name,
        description: args.description,
        slug,
        template: args.template,
      },
    });

    logger.info('Tool: createForgeProject executed', {
      forgeProjectId: project.id,
      userId: context.userId,
    });

    return {
      success: true,
      forgeProjectId: project.id,
      name: project.name,
      template: project.template,
    };
  } catch (error) {
    logger.error('Tool: createForgeProject failed', error as Error);
    throw error;
  }
}

export async function searchMarket(
  context: ToolExecutionContext,
  args: { query: string; category?: string; limit?: number }
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { name: { contains: args.query, mode: 'insensitive' } },
          { description: { contains: args.query, mode: 'insensitive' } },
        ],
        ...(args.category && { categoryId: args.category }),
      },
      take: args.limit || 5,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: { select: { name: true } },
      },
    });

    return {
      success: true,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category.name,
      })),
      count: products.length,
    };
  } catch (error) {
    logger.error('Tool: searchMarket failed', error as Error);
    throw error;
  }
}
