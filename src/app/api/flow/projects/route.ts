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
    const { name, description, workspaceId } = body;

    if (!name || !workspaceId) {
      throw new ValidationError('Missing required fields');
    }

    const project = await flowService.createProject(user.id, workspaceId, {
      name,
      description,
    });

    return NextResponse.json(project);
  } catch (error) {
    logger.error('POST /api/flow/projects failed', error as Error);
    const err = error as any;
    return NextResponse.json(
      { error: err.message || 'Failed to create project' },
      { status: err.statusCode || 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(
      request.headers.get('x-user-id') || ''
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = request.nextUrl.searchParams.get('workspaceId');
    if (!workspaceId) {
      throw new ValidationError('Missing workspaceId parameter');
    }

    const projects = await flowService.listProjects(user.id, workspaceId);
    return NextResponse.json(projects);
  } catch (error) {
    logger.error('GET /api/flow/projects failed', error as Error);
    const err = error as any;
    return NextResponse.json(
      { error: err.message || 'Failed to list projects' },
      { status: err.statusCode || 500 }
    );
  }
}
