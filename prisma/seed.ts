import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventify.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@eventify.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@eventify.com' },
    update: {},
    create: {
      username: 'user',
      email: 'user@eventify.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log(`✅ Users seeded: admin (id=${admin.id}), user (id=${regularUser.id})`);

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------
  const music = await prisma.category.upsert({
    where: { slug: 'music' },
    update: {},
    create: { name: 'Music', slug: 'music', color: '#FF6B6B', icon: '🎵' },
  });

  const tech = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: 'Tech', slug: 'tech', color: '#4ECDC4', icon: '💻' },
  });

  const food = await prisma.category.upsert({
    where: { slug: 'food' },
    update: {},
    create: { name: 'Food', slug: 'food', color: '#F38181', icon: '🍕' },
  });

  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: { name: 'Sports', slug: 'sports', color: '#95E1D3', icon: '⚽' },
  });

  const art = await prisma.category.upsert({
    where: { slug: 'art' },
    update: {},
    create: { name: 'Art', slug: 'art', color: '#AA96DA', icon: '🎨' },
  });

  console.log('✅ Categories seeded: Music, Tech, Food, Sports, Art');

  // ---------------------------------------------------------------------------
  // Events  (6 published; 3 featured)
  // ---------------------------------------------------------------------------
  const eventsData = [
    {
      title: 'Summer Music Festival 2025',
      slug: 'summer-music-festival-2025',
      description:
        'Join us for an unforgettable night of live music under the stars at Central Park. Featuring world-class artists across multiple stages.',
      date: '2025-07-15',
      time: '18:00',
      venueAddress: 'Central Park, New York, NY 10024',
      coordinatesLat: 40.785091,
      coordinatesLng: -73.968285,
      ticketPrice: 45.0,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
      status: 'PUBLISHED',
      categoryId: music.id,
      organizerId: admin.id,
    },
    {
      title: 'NYC Tech Summit 2025',
      slug: 'nyc-tech-summit-2025',
      description:
        'Connect with industry leaders, explore cutting-edge innovations, and attend workshops on AI, cloud computing, and web development.',
      date: '2025-08-20',
      time: '09:00',
      venueAddress: 'Javits Center, 655 W 34th St, New York, NY 10001',
      coordinatesLat: 40.757305,
      coordinatesLng: -74.002038,
      ticketPrice: 99.0,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      status: 'PUBLISHED',
      categoryId: tech.id,
      organizerId: admin.id,
    },
    {
      title: 'Brooklyn Food & Wine Festival',
      slug: 'brooklyn-food-wine-festival-2025',
      description:
        "Taste your way through Brooklyn with over 50 local chefs and 100+ wines. A culinary celebration you won't want to miss.",
      date: '2025-09-06',
      time: '12:00',
      venueAddress: 'Prospect Park, Brooklyn, NY 11215',
      coordinatesLat: 40.660569,
      coordinatesLng: -73.969112,
      ticketPrice: 35.0,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      status: 'PUBLISHED',
      categoryId: food.id,
      organizerId: admin.id,
    },
    {
      title: 'Manhattan 5K Run 2025',
      slug: 'manhattan-5k-run-2025',
      description:
        'Lace up your running shoes for this scenic 5K through the heart of Manhattan. All fitness levels welcome.',
      date: '2025-06-28',
      time: '07:30',
      venueAddress: 'Riverside Park, New York, NY 10024',
      coordinatesLat: 40.801526,
      coordinatesLng: -73.971046,
      ticketPrice: 20.0,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
      status: 'PUBLISHED',
      categoryId: sports.id,
      organizerId: admin.id,
    },
    {
      title: 'Chelsea Art Gallery Opening',
      slug: 'chelsea-art-gallery-opening-2025',
      description:
        'Be the first to experience an exclusive opening night featuring emerging artists from the New York contemporary art scene.',
      date: '2025-10-03',
      time: '19:00',
      venueAddress: '529 W 20th St, New York, NY 10011',
      coordinatesLat: 40.746157,
      coordinatesLng: -74.005678,
      ticketPrice: 0.0,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=800',
      status: 'PUBLISHED',
      categoryId: art.id,
      organizerId: admin.id,
    },
    {
      title: 'Jazz in the Garden 2025',
      slug: 'jazz-in-the-garden-2025',
      description:
        'An intimate evening of live jazz in the Brooklyn Botanic Garden. Bring a picnic blanket and enjoy the music among the blooms.',
      date: '2025-08-09',
      time: '17:00',
      venueAddress: 'Brooklyn Botanic Garden, 990 Washington Ave, Brooklyn, NY 11225',
      coordinatesLat: 40.669308,
      coordinatesLng: -73.961555,
      ticketPrice: 25.0,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
      status: 'PUBLISHED',
      categoryId: music.id,
      organizerId: admin.id,
    },
  ];

  const createdEvents: { id: number }[] = [];

  for (const eventData of eventsData) {
    const event = await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: eventData,
    });
    createdEvents.push(event);
  }

  console.log(`✅ Events seeded: ${createdEvents.length} published events (3 featured)`);

  // ---------------------------------------------------------------------------
  // RSVPs  (regular user → event 1 and event 2)
  // ---------------------------------------------------------------------------
  const rsvp1 = await prisma.rSVP.upsert({
    where: { userId_eventId: { userId: regularUser.id, eventId: createdEvents[0].id } },
    update: {},
    create: { userId: regularUser.id, eventId: createdEvents[0].id },
  });

  const rsvp2 = await prisma.rSVP.upsert({
    where: { userId_eventId: { userId: regularUser.id, eventId: createdEvents[1].id } },
    update: {},
    create: { userId: regularUser.id, eventId: createdEvents[1].id },
  });

  console.log(`✅ RSVPs seeded: user RSVPed to event ${rsvp1.eventId} and event ${rsvp2.eventId}`);

  // ---------------------------------------------------------------------------
  // Favorites  (regular user → event 1)
  // ---------------------------------------------------------------------------
  const favorite = await prisma.favorite.upsert({
    where: { userId_eventId: { userId: regularUser.id, eventId: createdEvents[0].id } },
    update: {},
    create: { userId: regularUser.id, eventId: createdEvents[0].id },
  });

  console.log(`✅ Favorites seeded: user favorited event ${favorite.eventId}`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
