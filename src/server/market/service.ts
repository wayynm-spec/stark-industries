import { prisma } from '@/server/database';
import { NotFoundError, ForbiddenError } from '@/types';
import { logger } from '@/lib/logger';

export async function createProduct(
  userId: string,
  workspaceId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
  }
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

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        workspaceId,
        name: data.name,
        description: data.description,
        price: data.price * 100, // Store as cents
        currency: 'USD',
        categoryId: data.categoryId,
        slug,
        sellerId: userId,
        status: 'DRAFT',
      },
    });

    logger.info('Product created', { productId: product.id, userId });
    return product;
  } catch (error) {
    logger.error('Failed to create product', error as Error);
    throw error;
  }
}

export async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  } catch (error) {
    logger.error('Failed to get product', error as Error);
    throw error;
  }
}

export async function listProducts(
  categoryId?: string,
  search?: string,
  limit = 20,
  offset = 0
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        ...(categoryId && { categoryId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        category: { select: { name: true } },
      },
    });

    const total = await prisma.product.count({
      where: {
        status: 'PUBLISHED',
        ...(categoryId && { categoryId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });

    return { products, total };
  } catch (error) {
    logger.error('Failed to list products', error as Error);
    throw error;
  }
}

export async function publishProduct(userId: string, productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.sellerId !== userId) {
      throw new ForbiddenError('Not product owner');
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { status: 'PUBLISHED' },
    });

    logger.info('Product published', { productId, userId });
    return updated;
  } catch (error) {
    logger.error('Failed to publish product', error as Error);
    throw error;
  }
}

export async function createOrder(
  buyerId: string,
  items: Array<{ productId: string; quantity: number }>
) {
  try {
    let total = 0;

    // Validate products and calculate total server-side
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }

      if (product.status !== 'PUBLISHED') {
        throw new NotFoundError(`Product ${item.productId} is not available`);
      }

      total += product.price * item.quantity;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId,
        total,
        currency: 'USD',
        status: 'PENDING',
        items: {
          createMany: {
            data: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: 0, // Will be set in separate query
            })),
          },
        },
      },
      include: { items: true },
    });

    logger.info('Order created', { orderId: order.id, buyerId });
    return order;
  } catch (error) {
    logger.error('Failed to create order', error as Error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (error) {
    logger.error('Failed to get categories', error as Error);
    throw error;
  }
}
