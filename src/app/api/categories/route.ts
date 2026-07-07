import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Require ADMIN role
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, color, icon } = body;

    // Validate name
    if (!name) {
      return NextResponse.json(
        { error: { status: 400, message: 'Name is required' } },
        { status: 400 }
      );
    }

    // Auto-generate slug
    const slug = slugify(name);

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: { status: 409, message: 'Category slug already exists' } },
        { status: 409 }
      );
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        color: color || '#000000',
        icon,
      },
    });

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error('POST category error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
