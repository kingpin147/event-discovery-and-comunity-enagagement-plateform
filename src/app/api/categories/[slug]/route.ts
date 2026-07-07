import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    const category = await prisma.category.update({
      where: { slug },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(icon !== undefined && { icon }),
      },
    });

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error('PUT category error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    // Require ADMIN role
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Admin access required' } },
        { status: 403 }
      );
    }

    // Find category
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json(
        { error: { status: 404, message: 'Category not found' } },
        { status: 404 }
      );
    }

    // Check if category has events
    const eventCount = await prisma.event.count({
      where: { categoryId: category.id },
    });

    if (eventCount > 0) {
      return NextResponse.json(
        { error: { status: 400, message: 'Cannot delete category with existing events' } },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { slug },
    });

    return NextResponse.json({ data: { message: 'Category deleted' } });
  } catch (error) {
    console.error('DELETE category error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
