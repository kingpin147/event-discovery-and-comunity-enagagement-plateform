# Event Discovery & Community Engagement Platform

This repository now contains the main Next.js application for discovering, browsing, and managing community events, along with an optional Strapi backend companion in the strapi-backend folder.

## What is included

- Public home, events, about, and contact pages
- Event discovery with search, filters, and an interactive Leaflet map
- Event detail pages with RSVP, favorite, and review support
- Authenticated dashboards for RSVPs, favorites, profile, and event submission
- Admin moderation and user role management
- Prisma-backed persistence for the main app data layer

## Current stack

- Next.js 16 with the App Router
- TypeScript
- Tailwind CSS and shadcn/ui
- NextAuth.js for credentials-based authentication
- Prisma ORM with PostgreSQL via DATABASE_URL
- Leaflet and react-leaflet for interactive maps
- Optional Strapi CMS backend in strapi-backend/

## Quick start

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000 to view the app.

## Key folders

- src/app/ — pages, layouts, and route handlers
- src/components/ — reusable UI and event components
- src/lib/ — auth, database, and helper utilities
- prisma/ — schema, migrations, and seed data
- strapi-backend/ — optional Strapi CMS backend companion

## Useful commands

```bash
npm run build
npx prisma studio
npx prisma migrate dev --name <change-name>
```

## Optional Strapi backend

```bash
cd strapi-backend
npm install
npm run develop
```

## Verification status

The current project structure is aligned with the Next.js app in the repository root and the optional Strapi backend under strapi-backend/.
