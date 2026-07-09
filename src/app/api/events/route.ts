import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchStrapi } from '@/lib/strapi';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '12'));
    const featured = searchParams.get('featured');

    const qs = new URLSearchParams();
    qs.set('populate', 'category');
    qs.set('pagination[page]', String(page));
    qs.set('pagination[pageSize]', String(limit));
    qs.set('sort[0]', 'createdAt:desc');

    // Only fetch PUBLISHED events by default for public discovery
    qs.set('filters[status][$eq]', 'PUBLISHED');

    if (search) {
      qs.set('filters[$or][0][title][$contains]', search);
      qs.set('filters[$or][1][venueAddress][$contains]', search);
    }

    if (category) {
      qs.set('filters[category][slug][$eq]', category);
    }

    if (featured === 'true') {
      qs.set('filters[featured][$eq]', 'true');
    }

    const strapiRes = await fetchStrapi(`events?${qs.toString()}`);

    // Map Strapi events to the client format (ensure fields are populated)
    const data = (strapiRes.data || []).map((item: any) => {
      return {
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        slug: item.slug,
        description: item.description,
        date: item.date,
        time: item.time,
        venueAddress: item.venueAddress,
        coordinatesLat: item.coordinatesLat,
        coordinatesLng: item.coordinatesLng,
        ticketPrice: item.ticketPrice,
        featured: item.featured,
        imageUrl: item.imageUrl,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        category: item.category || null,
        organizer: item.organizer || null,
        rsvpCount: 0, 
      };
    });

    // Hydrate the rsvpCount from local database
    const eventIds = data.map((e: any) => e.id);
    if (eventIds.length > 0) {
      const { prisma } = await import('@/lib/db');
      const rsvps = await prisma.rSVP.groupBy({
        by: ['eventId'],
        where: { eventId: { in: eventIds } },
        _count: { id: true },
      });
      const rsvpMap = new Map(rsvps.map((r: any) => [r.eventId, r._count.id]));
      data.forEach((e: any) => {
        e.rsvpCount = rsvpMap.get(e.id) || 0;
      });
    }

    return NextResponse.json({
      data,
      meta: {
        pagination: {
          page,
          pageSize: limit,
          total: strapiRes.meta?.pagination?.total || 0,
          pageCount: strapiRes.meta?.pagination?.pageCount || 1,
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
    const { slugify } = await import('@/lib/utils');
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 2;

    // Check slug uniqueness in Strapi
    while (true) {
      const checkRes = await fetchStrapi(`events?filters[slug][$eq]=${slug}`);
      if (!checkRes.data || checkRes.data.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Post to Strapi
    const organizerId = parseInt((session.user as any).id);
    const strapiRes = await fetchStrapi('events', {
      method: 'POST',
      body: JSON.stringify({
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
          category: categoryId ? parseInt(categoryId) : null,
          organizerId,
          status: 'DRAFT',
        }
      })
    });

    if (!strapiRes.data) {
      throw new Error(strapiRes.error?.message || 'Failed to create event in Strapi');
    }

    const createdEvent = {
      id: strapiRes.data.id,
      documentId: strapiRes.data.documentId,
      title: strapiRes.data.title,
      slug: strapiRes.data.slug,
      description: strapiRes.data.description,
      date: strapiRes.data.date,
      time: strapiRes.data.time,
      venueAddress: strapiRes.data.venueAddress,
      ticketPrice: strapiRes.data.ticketPrice,
      imageUrl: strapiRes.data.imageUrl,
      status: strapiRes.data.status,
    };

    return NextResponse.json({ data: createdEvent });
  } catch (error: any) {
    console.error('POST event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
