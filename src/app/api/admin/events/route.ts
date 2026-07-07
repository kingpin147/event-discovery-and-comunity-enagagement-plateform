import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: { status: 403, message: 'Admin access required' } }, { status: 403 });
    }

    const events = await prisma.event.findMany({
      include: { category: true, organizer: { select: { id: true, username: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: events });
  } catch (error) {
    console.error('GET admin events error:', error);
    return NextResponse.json({ error: { status: 500, message: 'Internal server error' } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: { status: 403, message: 'Admin access required' } }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, featured } = body;

    if (!id) {
      return NextResponse.json({ error: { status: 400, message: 'id is required' } }, { status: 400 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        ...(status && { status }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json({ data: updatedEvent });
  } catch (error) {
    console.error('PATCH admin events error:', error);
    return NextResponse.json({ error: { status: 500, message: 'Internal server error' } }, { status: 500 });
  }
}
