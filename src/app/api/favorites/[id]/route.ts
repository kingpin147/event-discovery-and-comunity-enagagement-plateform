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

    const favoriteId = parseInt(id);

    // Find favorite
    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: { status: 404, message: 'Favorite not found' } },
        { status: 404 }
      );
    }

    // Check ownership
    const userId = parseInt((session.user as any).id);
    if (favorite.userId !== userId) {
      return NextResponse.json(
        { error: { status: 403, message: 'Not authorized to delete this favorite' } },
        { status: 403 }
      );
    }

    await prisma.favorite.delete({
      where: { id: favoriteId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE favorite error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
