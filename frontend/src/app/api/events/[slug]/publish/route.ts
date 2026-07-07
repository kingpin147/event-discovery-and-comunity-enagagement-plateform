import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Require ADMIN role
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Admin access required' } },
        { status: 403 }
      );
    }

    // Find event by slug
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    });

    if (!event) {
      return NextResponse.json(
        { error: { status: 404, message: 'Event not found' } },
        { status: 404 }
      );
    }

    // Update status to PUBLISHED
    const updatedEvent = await prisma.event.update({
      where: { slug: params.slug },
      data: { status: 'PUBLISHED' },
    });

    return NextResponse.json({ data: updatedEvent });
  } catch (error) {
    console.error('PATCH publish event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
