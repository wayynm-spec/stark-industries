import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase';
import * as flowService from '@/server/flow/service';
import { ValidationError } from '@/types';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(
      request.headers.get('x-user-id') || ''
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, projectId, priority, dueDate } = body;

    if (!title || !projectId) {
      throw new ValidationError('Missing required fields');
    }

    const task = await flowService.createTask(user.id, projectId, {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return NextResponse.json(task);
  } catch (error) {
    logger.error('POST /api/flow/tasks failed', error as Error);
    const err = error as any;
    return NextResponse.json(
      { error: err.message || 'Failed to create task' },
      { status: err.statusCode || 500 }
    );
  }
}
