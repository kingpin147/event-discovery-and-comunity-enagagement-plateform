# Event Discovery & Community Engagement Platform

This repository now contains a unified Next.js application for discovering, browsing, and managing community events. The app combines the public event experience, authenticated dashboards, and admin moderation in one codebase.

## What is included

- Public home, events, about, and contact pages
- Event discovery with search, filters, and an interactive Leaflet map
- Event detail pages with RSVP and review support
- Authenticated dashboards for RSVPs, favorites, profile, and event submission
- Admin moderation and user role management
- Prisma-backed persistence with SQLite for local development

## Current stack

- Next.js 16 with the App Router
- TypeScript
- Tailwind CSS and shadcn/ui
- NextAuth.js for credentials-based authentication
- Prisma ORM with SQLite locally
- Leaflet and react-leaflet for interactive maps

## Quick start

```bash
npm install
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

## Useful commands

```bash
npm run build
npx prisma studio
npx prisma migrate dev --name <change-name>
```

## Verification status

The current project builds successfully with npm run build and includes the main user flows described above.
