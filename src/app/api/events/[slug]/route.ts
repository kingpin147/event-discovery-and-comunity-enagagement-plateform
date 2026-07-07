import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        _count: { select: { rsvps: true } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: { status: 404, message: 'Event not found' } },
        { status: 404 }
      );
    }

    // Check if current user has RSVPed
    let userHasRSVPed = false;
    if (session?.user) {
      const userId = parseInt((session.user as any).id);
      const rsvp = await prisma.rSVP.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId: event.id,
          },
        },
      });
      userHasRSVPed = !!rsvp;
    }

    return NextResponse.json({
      data: {
        ...event,
        rsvpCount: event._count.rsvps,
        userHasRSVPed,
      },
    });
  } catch (error) {
    console.error('GET event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const userId = parseInt((session.user as any).id);
    const role = (session.user as any).role;

    // Find the event
    const event = await prisma.event.findUnique({
      where: { slug },
    });

    if (!event) {
      return NextResponse.json(
        { error: { status: 404, message: 'Event not found' } },
        { status: 404 }
      );
    }

    // Check ownership or admin
    if (event.organizerId !== userId && role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Not authorized to update this event' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      date,
      time,
      venueAddress,
      coordinatesLat,
      coordinatesLng,
      ticketPrice,
      featured,
      imageUrl,
      categoryId,
      status,
    } = body;

    const updatedEvent = await prisma.event.update({
      where: { slug },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(date && { date }),
        ...(time && { time }),
        ...(venueAddress && { venueAddress }),
        ...(coordinatesLat !== undefined && { coordinatesLat: parseFloat(coordinatesLat) }),
        ...(coordinatesLng !== undefined && { coordinatesLng: parseFloat(coordinatesLng) }),
        ...(ticketPrice !== undefined && { ticketPrice: parseFloat(ticketPrice) }),
        ...(featured !== undefined && { featured }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(status && role === 'ADMIN' && { status }),
      },
    });

    return NextResponse.json({ data: updatedEvent });
  } catch (error) {
    console.error('PUT event error:', error);
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

    if (!session?.user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const userId = parseInt((session.user as any).id);
    const role = (session.user as any).role;

    // Find the event
    const event = await prisma.event.findUnique({
      where: { slug },
    });

    if (!event) {
      return NextResponse.json(
        { error: { status: 404, message: 'Event not found' } },
        { status: 404 }
      );
    }

    // Check ownership or admin
    if (event.organizerId !== userId && role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Not authorized to delete this event' } },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: { slug },
    });

    return NextResponse.json({ data: { message: 'Event deleted' } });
  } catch (error) {
    console.error('DELETE event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
