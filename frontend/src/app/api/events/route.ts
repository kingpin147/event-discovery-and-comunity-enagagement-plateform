import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '12'));
    const featured = searchParams.get('featured');

    // Build where clause
    const where: any = { status: 'PUBLISHED' };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { venueAddress: { contains: search } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Count total
    const total = await prisma.event.count({ where });

    // Fetch paginated events
    const events = await prisma.event.findMany({
      where,
      include: {
        category: true,
        _count: { select: { rsvps: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Map to include rsvpCount
    const data = events.map((event) => ({
      ...event,
      rsvpCount: event._count.rsvps,
    }));

    return NextResponse.json({
      data,
      meta: {
        pagination: {
          page,
          pageSize: limit,
          total,
          pageCount: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('GET events error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

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
    } = body;

    // Validate required fields
    if (!title || !date || !time || !venueAddress) {
      return NextResponse.json(
        { error: { status: 400, message: 'title, date, time, and venueAddress are required' } },
        { status: 400 }
      );
    }

    // Auto-generate slug from title, ensure uniqueness
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 2;

    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        date,
        time,
        venueAddress,
        coordinatesLat: coordinatesLat ? parseFloat(coordinatesLat) : undefined,
        coordinatesLng: coordinatesLng ? parseFloat(coordinatesLng) : undefined,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
        featured: featured || false,
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        organizerId: parseInt((session.user as any).id),
        status: 'DRAFT',
      },
    });

    return NextResponse.json({ data: event });
  } catch (error) {
    console.error('POST event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
