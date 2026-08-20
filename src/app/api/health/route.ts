import { NextResponse } from 'next/server';
import { prisma } from '@/server/database';
import { logger } from '@/lib/logger';

export async function GET(): Promise<NextResponse> {
  const health = {
    app: 'ok' as const,
    database: 'ok' as const,
    auth: 'ok' as const,
    ai: 'missing_config' as const,
    timestamp: new Date().toISOString(),
  };

  try {
    // Test database
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    health.database = 'error';
    logger.error('Database health check failed', error as Error);
  }

  const statusCode = health.database === 'ok' ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
