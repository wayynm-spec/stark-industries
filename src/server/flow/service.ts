import { prisma } from '@/server/database';
import { NotFoundError, ForbiddenError, ValidationError } from '@/types';
import { logger } from '@/lib/logger';

export async function createProject(
  userId: string,
  workspaceId: string,
  data: { name: string; description?: string }
) {
  try {
    // Verify workspace access
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenError('No access to workspace');
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const project = await prisma.project.create({
      data: {
        workspaceId,
        name: data.name,
        description: data.description,
        slug,
      },
    });

    logger.info('Project created', { projectId: project.id, userId });
    return project;
  } catch (error) {
    logger.error('Failed to create project', error as Error);
    throw error;
  }
}

export async function getProject(userId: string, projectId: string) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: { userId },
          },
        },
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  } catch (error) {
    logger.error('Failed to get project', error as Error);
    throw error;
  }
}

export async function listProjects(userId: string, workspaceId: string) {
  try {
    // Verify workspace access
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenError('No access to workspace');
    }

    const projects = await prisma.project.findMany({
      where: {
        workspaceId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    return projects;
  } catch (error) {
    logger.error('Failed to list projects', error as Error);
    throw error;
  }
}

export async function createTask(
  userId: string,
  projectId: string,
  data: {
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: Date;
  }
) {
  try {
    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: { userId },
          },
        },
      },
    });

    if (!project) {
      throw new ForbiddenError('No access to project');
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate,
      },
    });

    logger.info('Task created', { taskId: task.id, projectId, userId });
    return task;
  } catch (error) {
    logger.error('Failed to create task', error as Error);
    throw error;
  }
}

export async function updateTaskStatus(
  userId: string,
  taskId: string,
  status: 'BACKLOG' | 'TODO' | 'DOING' | 'REVIEW' | 'DONE'
) {
  try {
    // Verify access
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          workspace: {
            members: {
              some: { userId },
            },
          },
        },
      },
    });

    if (!task) {
      throw new ForbiddenError('No access to task');
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    logger.info('Task status updated', { taskId, status, userId });
    return updated;
  } catch (error) {
    logger.error('Failed to update task', error as Error);
    throw error;
  }
}

export async function getTasks(userId: string, projectId: string) {
  try {
    // Verify access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: { userId },
          },
        },
      },
    });

    if (!project) {
      throw new ForbiddenError('No access to project');
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return tasks;
  } catch (error) {
    logger.error('Failed to get tasks', error as Error);
    throw error;
  }
}
