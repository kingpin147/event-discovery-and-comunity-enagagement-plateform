# Zero-to-Hero Developer Guide

This guide explains the current event platform from scratch.

## 1. What this project is

This is an event discovery and community engagement application. Users can browse events, view them on a map, sign up, RSVP, save favorites, and submit their own events.

## 2. How to run it

1. Install dependencies with npm install
2. Configure DATABASE_URL for PostgreSQL
3. Run Prisma migrations with npx prisma migrate dev
4. Seed sample data with npx prisma db seed
5. Start the app with npm run dev
6. Open http://localhost:3000

## 3. Important folders

| Feature | Folder | Why it matters |
| :--- | :--- | :--- |
| Pages and routes | src/app/ | Contains the home page, event pages, dashboards, admin pages, and API routes |
| Reusable UI | src/components/ | Contains the navbar, cards, buttons, map components, and shared UI |
| Authentication and helpers | src/lib/ | Contains auth configuration, database access, and helper utilities |
| Database schema | prisma/ | Contains the Prisma schema, migrations, and seed script |
| Optional CMS backend | strapi-backend/ | Contains the companion Strapi backend for CMS-style workflows |

## 4. Main features to know

- Home and events pages
- Event detail page with map and RSVP actions
- Authenticated dashboard for favorites and RSVPs
- Admin moderation screens
- Prisma-based persistence for events, users, categories, and reviews

## 5. Big-picture concepts for viva

1. Next.js powers the main app experience and API routes.
2. Prisma provides the database layer and type-safe queries.
3. NextAuth handles authentication and session management.
4. Tailwind CSS and shadcn/ui provide the polished UI.
5. Strapi is optional and lives separately in strapi-backend/.

## 6. Common troubleshooting

- If the app fails to start, run npm install again.
- If database tables are missing, run npx prisma migrate dev.
- If sample content is missing, run npx prisma db seed.
- If the map is blank, check that the browser can load OpenStreetMap tiles.
- If you want the Strapi backend, run it from the strapi-backend folder.
