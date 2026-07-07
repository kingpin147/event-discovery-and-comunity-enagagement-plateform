import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: { status: 400, message: 'eventId is required' } }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { eventId: Number(eventId) },
      include: { user: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: reviews });
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json({ error: { status: 500, message: 'Internal server error' } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: { status: 401, message: 'Authentication required' } }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, rating, comment } = body;

    if (!eventId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: { status: 400, message: 'eventId and a rating between 1 and 5 are required' } }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
    if (!event) {
      return NextResponse.json({ error: { status: 404, message: 'Event not found' } }, { status: 404 });
    }

    const userId = Number((session.user as any).id);

    const review = await prisma.review.create({
      data: {
        userId,
        eventId: Number(eventId),
        rating,
        comment: comment?.trim() || null,
      },
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: { status: 409, message: 'You already reviewed this event' } }, { status: 409 });
    }

    console.error('POST review error:', error);
    return NextResponse.json({ error: { status: 500, message: 'Internal server error' } }, { status: 500 });
  }
}
