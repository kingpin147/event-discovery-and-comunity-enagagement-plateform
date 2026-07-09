# Event Discovery & Community Engagement Platform Implementation Plan

This document reflects the current implementation of the project. The main application runs as a Next.js project in the repository root, while the strapi-backend folder provides an optional separate Strapi backend for CMS-style content workflows.

## Current architecture

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui
- Authentication: NextAuth.js credentials provider
- Data layer: Prisma with PostgreSQL configured through DATABASE_URL
- Maps: Leaflet and react-leaflet
- Content and actions: Next.js route handlers under src/app/api
- Companion backend: Strapi in strapi-backend/

## Implemented features

- Public browsing pages for home, events, about, and contact
- Search, category filters, and map/list view on the events page
- Event detail pages with venue, RSVP, and review support
- Authenticated dashboards for RSVPs, favorites, profile, and event submission
- Admin moderation and role management views
- Review and rating support for events

## Project structure

- src/app/ — application pages and API routes
- src/components/ — reusable UI and event components
- src/lib/ — auth, database, helpers, and shared utilities
- prisma/ — schema, migrations, and seed data
- strapi-backend/ — optional Strapi CMS backend companion

## Development checklist

- [x] Install dependencies and configure the app shell
- [x] Set up Prisma models and database migrations
- [x] Implement authentication and protected routes
- [x] Build public and dashboard pages
- [x] Add API routes for events, categories, RSVPs, favorites, and uploads
- [x] Add admin moderation and user management pages
- [x] Keep the documentation aligned with the current repository structure

## Optional future enhancements

- Cloudinary-backed image hosting
- Redis caching for high-traffic reads
- Advanced moderation history and audit trails
- Production deployment on PostgreSQL-backed hosting
