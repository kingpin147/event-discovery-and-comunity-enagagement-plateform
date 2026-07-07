import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Require auth
    if (!session?.user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId } = body;

    // Validate eventId is a number
    if (!eventId || typeof eventId !== 'number') {
      return NextResponse.json(
        { error: { status: 400, message: 'eventId must be a number' } },
        { status: 400 }
      );
    }

    // Check event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: { status: 404, message: 'Event not found' } },
        { status: 404 }
      );
    }

    const userId = parseInt((session.user as any).id);

    // Create RSVP
    try {
      const rsvp = await prisma.rSVP.create({
        data: {
          userId,
          eventId,
        },
      });

      return NextResponse.json({ data: rsvp }, { status: 201 });
    } catch (prismaError: any) {
      // Handle unique constraint violation (P2002)
      if (prismaError?.code === 'P2002') {
        return NextResponse.json(
          { error: { status: 409, message: 'Already RSVPed' } },
          { status: 409 }
        );
      }
      throw prismaError;
    }
  } catch (error) {
    console.error('POST rsvp error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
