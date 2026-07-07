import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Require auth
    if (!session?.user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const rsvpId = parseInt(id);

    // Find RSVP
    const rsvp = await prisma.rSVP.findUnique({
      where: { id: rsvpId },
    });

    if (!rsvp) {
      return NextResponse.json(
        { error: { status: 404, message: 'RSVP not found' } },
        { status: 404 }
      );
    }

    // Check ownership
    const userId = parseInt((session.user as any).id);
    if (rsvp.userId !== userId) {
      return NextResponse.json(
        { error: { status: 403, message: 'Not authorized to delete this RSVP' } },
        { status: 403 }
      );
    }

    await prisma.rSVP.delete({
      where: { id: rsvpId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE rsvp error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
