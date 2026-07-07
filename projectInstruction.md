# Current Project Instructions

## Project Title

Event Discovery & Community Engagement Platform

## Current Architecture

This repository is now a single Next.js application rooted at the workspace root. It uses internal API routes, Prisma for data access, and NextAuth for authentication rather than a separate Strapi backend.

## What the platform does

- Lets visitors browse public events, search by keyword, and filter by category
- Displays event listings together with an interactive Leaflet map
- Shows detailed event pages with venue information, pricing, and RSVP actions
- Supports authenticated users with favorites, RSVPs, profile management, and event submission
- Provides admin pages for moderation and user management

## Core roles

### Guest user
- Browse events and view details
- Search and filter events
- Access the about and contact pages

### Registered user
- RSVP to events
- Save favorites
- View their dashboard and manage personal activity
- Submit new events for review

### Administrator
- Review or manage submitted events
- Manage user roles and administrative access

## Current implementation stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- Maps: Leaflet and react-leaflet
- Authentication: NextAuth.js with credentials login
- Database: Prisma with SQLite locally
- API: Next.js route handlers in src/app/api

## Project structure

- src/app/ — pages and route handlers
- src/components/ — UI and event-specific components
- src/lib/ — auth, database, API helpers, and utilities
- prisma/ — schema, migrations, and seed data

## Development workflow

1. Install dependencies with npm install
2. Run Prisma migrations with npx prisma migrate dev
3. Seed sample data with npx prisma db seed
4. Start the app with npm run dev
5. Verify the build with npm run build

## Notes for contributors

- Keep new features aligned with the existing App Router structure
- Prefer Prisma for database changes rather than introducing a separate backend
- Add or update documentation whenever the app behavior changes
