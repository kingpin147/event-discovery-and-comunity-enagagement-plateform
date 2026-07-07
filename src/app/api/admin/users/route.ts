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

    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('GET admin users error:', error);
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
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: { status: 400, message: 'id and role are required' } }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });

    return NextResponse.json({ data: updatedUser });
  } catch (error) {
    console.error('PATCH admin users error:', error);
    return NextResponse.json({ error: { status: 500, message: 'Internal server error' } }, { status: 500 });
  }
}
