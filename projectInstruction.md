# Current Project Instructions

## Project Title

Event Discovery & Community Engagement Platform

## Current Architecture

The repository contains the main Next.js application at the workspace root and an optional Strapi backend in the strapi-backend folder. The core product experience is delivered by the Next.js app, while the Strapi folder can be used for CMS-style content workflows.

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

- Frontend: Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui
- Maps: Leaflet and react-leaflet
- Authentication: NextAuth.js with credentials login
- Database: Prisma with PostgreSQL via DATABASE_URL
- API: Next.js route handlers in src/app/api
- Optional backend: Strapi under strapi-backend/

## Project structure

- src/app/ — pages, layouts, and route handlers
- src/components/ — UI and event-specific components
- src/lib/ — auth, database, API helpers, and utilities
- prisma/ — schema, migrations, and seed data
- strapi-backend/ — optional Strapi CMS backend companion

## Development workflow

1. Install dependencies with npm install
2. Configure the DATABASE_URL environment variable
3. Run Prisma migrations with npx prisma migrate dev
4. Seed sample data with npx prisma db seed
5. Start the app with npm run dev
6. Verify the build with npm run build

## Notes for contributors

- Keep new features aligned with the existing App Router structure
- Prefer Prisma for core event and user data changes
- Use the Strapi backend only when a CMS-style workflow is required
- Add or update documentation whenever the app behavior changes
