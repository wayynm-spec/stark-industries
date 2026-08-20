import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase';
import * as marketService from '@/server/market/service';
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
    const { name, description, price, categoryId, workspaceId } = body;

    if (!name || price === undefined || !categoryId || !workspaceId) {
      throw new ValidationError('Missing required fields');
    }

    if (price < 0) {
      throw new ValidationError('Price must be positive');
    }

    const product = await marketService.createProduct(user.id, workspaceId, {
      name,
      description,
      price,
      categoryId,
    });

    return NextResponse.json(product);
  } catch (error) {
    logger.error('POST /api/market/products failed', error as Error);
    const err = error as any;
    return NextResponse.json(
      { error: err.message || 'Failed to create product' },
      { status: err.statusCode || 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const categoryId = request.nextUrl.searchParams.get('categoryId') || undefined;
    const search = request.nextUrl.searchParams.get('search') || undefined;
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    const { products, total } = await marketService.listProducts(
      categoryId || undefined,
      search || undefined,
      limit,
      offset
    );

    return NextResponse.json({ products, total, hasMore: offset + limit < total });
  } catch (error) {
    logger.error('GET /api/market/products failed', error as Error);
    const err = error as any;
    return NextResponse.json(
      { error: err.message || 'Failed to list products' },
      { status: err.statusCode || 500 }
    );
  }
}
