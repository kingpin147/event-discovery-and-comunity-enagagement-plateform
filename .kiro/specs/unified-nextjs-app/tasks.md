# Implementation Plan: Unified Next.js Event Management Application

## Overview

This plan migrates the existing two-project setup (Strapi backend + Next.js frontend) into a single self-contained Next.js application. The implementation follows a bottom-up approach: install dependencies first, set up the database, build core library files, implement all API route handlers, update frontend pages, fix configuration, resolve known bugs, and finally verify the full application builds and runs correctly.

## Tasks

- [x] 1. Install Dependencies and Update package.json
  - [x] 1.1 Add `prisma` and `@prisma/client` to package.json dependencies
  - [x] 1.2 Add `bcryptjs` and `@types/bcryptjs` to package.json
  - [x] 1.3 Add `"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }` to package.json
  - [x] 1.4 Run `npm install` in the frontend directory to install new packages
  - [x] 1.5 Verify no peer-dependency conflicts
  - _Requirements: 1.1, 2.1, 3.2_

- [ ] 2. Set Up Prisma Schema and Database
  - [x] 2.1 Create `prisma/schema.prisma` with all models: User (with Role enum), Category, Event (with EventStatus enum), RSVP (unique userId+eventId), Favorite (unique userId+eventId)
  - [x] 2.2 Update `.env.local` to add `DATABASE_URL="file:./prisma/dev.db"` and `NEXT_PUBLIC_APP_URL="http://localhost:3000"`
  - [-] 2.3 Run `npx prisma migrate dev --name init` to create the SQLite database and tables
  - [x] 2.4 Create `prisma/seed.ts` that seeds: 1 admin user (admin@eventify.com / admin123, role ADMIN), 1 regular user (user@eventify.com / user123, role USER), 5 categories (Music, Tech, Food, Sports, Art with colors), 6 published events (3 featured, all with New York-area coordinates), 2 RSVPs (user RSVPed to events 1 and 2), 1 Favorite (user favorited event 1)
  - [-] 2.5 Run `npx prisma db seed` to populate the database
  - [-] 2.6 Run `npx prisma generate` to generate the Prisma client types
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

- [~] 3. Create Core Library Files
  - [~] 3.1 Create `src/lib/db.ts` — Prisma client singleton using `globalThis` pattern to prevent multiple instances in dev hot-reload
  - [~] 3.2 Create `src/lib/auth.ts` — NextAuth `authOptions` config: CredentialsProvider that queries `prisma.user.findUnique` by email, compares password with `bcrypt.compare`, returns `{ id, name: username, email, role }`; JWT callback to include `id` and `role`; session callback to expose `id` and `role` on `session.user`; `pages: { signIn: '/auth/signin' }`
  - [~] 3.3 Update `src/lib/redis.ts` — wrap with graceful fallback: check if env vars are present; if not, all `get` calls return `null` and all `set`/`del` calls are no-ops without throwing
  - [~] 3.4 Create `src/lib/api.ts` — typed client-side fetch helper functions: `getEvents(params?)`, `getEvent(slug)`, `createRSVP(eventId)`, `deleteRSVP(id)`, `createFavorite(eventId)`, `deleteFavorite(id)`, `getMyRSVPs()`, `getMyFavorites()`, `createEvent(data)`
  - [~] 3.5 Update `src/lib/utils.ts` — add `slugify(text: string): string` function that lowercases, replaces non-alphanumeric with hyphens, and trims leading/trailing hyphens
  - [~] 3.6 Update `src/types/index.ts` — add `RSVP`, `Favorite`, `PaginatedResponse<T>`, `EventStatus`, `UserRole` types; update `Event` type to include `id` as string (cuid), `venueAddress`, `coordinatesLat`/`coordinatesLng` (flat, not nested), `imageUrl`, `status`, `rsvpCount?`, `userHasRSVPed?`, `organizer?`; keep backward-compatible `venue_address` and `coordinates` aliases
  - _Requirements: 3.1, 3.2, 3.4, 15.1_

- [ ] 4. Build API Route Handlers
  - [~] 4.1 Create `src/app/api/auth/register/route.ts` — POST handler: validate `{ username, email, password }`, check email uniqueness (409 if taken), hash password with `bcrypt.hash(password, 10)`, create user with role USER, return `{ id, username, email }` (never return password)
  - [~] 4.2 Update `src/app/api/auth/[...nextauth]/route.ts` — import `authOptions` from `src/lib/auth.ts` and export `{ handler as GET, handler as POST }` (removes the inline config that pointed to Strapi)
  - [~] 4.3 Create `src/app/api/categories/route.ts` — GET: return all categories ordered by name (no auth). POST: require ADMIN role; validate `{ name, color?, icon? }`; auto-generate slug with `slugify`; check slug uniqueness; create and return category
  - [~] 4.4 Create `src/app/api/categories/[slug]/route.ts` — PUT: ADMIN only, update category fields; DELETE: ADMIN only, fail with 400 if category has events
  - [~] 4.5 Create `src/app/api/events/route.ts` — GET: parse query params (search, category, page=1, limit=12, featured); query Prisma for PUBLISHED events with optional search/category filters; return paginated response `{ data, meta: { pagination } }`. POST: require USER+ role; validate required fields; auto-generate slug; set organizerId; create with status DRAFT
  - [~] 4.6 Create `src/app/api/events/[slug]/route.ts` — GET: fetch event by slug with category, rsvpCount, and userHasRSVPed; return 404 if not found. PUT: require auth + ownership or ADMIN. DELETE: require auth + ownership or ADMIN
  - [~] 4.7 Create `src/app/api/events/[slug]/publish/route.ts` — PATCH: require ADMIN role; set event status to PUBLISHED; return updated event
  - [~] 4.8 Create `src/app/api/rsvps/route.ts` — POST: require auth; validate `{ eventId }`; check event exists; create RSVP (409 if duplicate); return created RSVP
  - [~] 4.9 Create `src/app/api/rsvps/my/route.ts` — GET: require auth; fetch all RSVPs for session user including event with category; return array
  - [~] 4.10 Create `src/app/api/rsvps/[id]/route.ts` — DELETE: require auth; verify RSVP belongs to session user (403 if not); delete and return 204
  - [~] 4.11 Create `src/app/api/favorites/route.ts` — POST: require auth; validate `{ eventId }`; check event exists; create favorite (409 if duplicate); return created favorite
  - [~] 4.12 Create `src/app/api/favorites/my/route.ts` — GET: require auth; fetch all favorites for session user including event with category; return array
  - [~] 4.13 Create `src/app/api/favorites/[id]/route.ts` — DELETE: require auth; verify favorite belongs to session user; delete and return 204
  - _Requirements: 3.3, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_

- [ ] 5. Update Frontend Pages and Components
  - [~] 5.1 Update `src/app/page.tsx` (Home) — replace mock FEATURED_EVENTS with server-side Prisma fetch for featured PUBLISHED events; keep all existing JSX; adapt Event shape mapping (venueAddress → venue_address) for EventCard compatibility
  - [~] 5.2 Update `src/app/events/page.tsx` (Discovery) — remove MOCK_EVENTS and MOCK_CATEGORIES; fetch categories from `/api/categories` and events from `/api/events` on mount using useEffect; implement "Load More" by incrementing page state; show loading skeleton while fetching; keep all map and layout JSX intact
  - [~] 5.3 Update `src/app/events/[slug]/page.tsx` (Detail) — convert to async Server Component; remove 'use client' directive; fetch event server-side via Prisma; add generateMetadata function; pass rsvpCount and userHasRSVPed as props to RSVPButton; keep all existing JSX
  - [~] 5.4 Update `src/components/events/rsvp-button.tsx` — wire real API call to `POST /api/rsvps`; accept isRSVPed prop; handle 409 gracefully; keep existing UI
  - [~] 5.5 Update `src/app/dashboard/page.tsx` (My RSVPs) — replace mock RSVP card with useEffect fetching `/api/rsvps/my`; implement "Cancel RSVP" via `DELETE /api/rsvps/[id]`; show empty state when no RSVPs
  - [~] 5.6 Update `src/app/dashboard/favorites/page.tsx` — fetch `/api/favorites/my` on mount; render favorite event cards with "Remove" button calling `DELETE /api/favorites/[id]`; show empty state when no favorites
  - [~] 5.7 Update `src/app/dashboard/create-event/page.tsx` — replace simulated API call with real `POST /api/events`; handle validation errors; show success screen on completion
  - [~] 5.8 Fix `src/app/auth/signin/page.tsx` — add missing `import Link from 'next/link'`
  - [~] 5.9 Update `src/app/auth/signup/page.tsx` — change registration URL from NEXT_PUBLIC_STRAPI_API_URL to `/api/auth/register`
  - [~] 5.10 Fix `src/components/layout/navbar.tsx` — fix SheetTrigger usage; use correct shadcn `SheetTrigger asChild` pattern
  - [~] 5.11 Update `src/components/events/event-card.tsx` — ensure component handles both snake_case venue_address and camelCase venueAddress; keep all existing JSX
  - _Requirements: 8.1, 8.2, 8.3, 8.6, 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 10.1, 10.6, 10.7, 11.2, 11.3, 11.4, 11.5, 11.6, 3.6, 3.7_

- [ ] 6. Update Configuration Files
  - [~] 6.1 Update `next.config.ts` — add `images.remotePatterns` for res.cloudinary.com, images.unsplash.com, and unpkg.com
  - [~] 6.2 Update `tsconfig.json` — ensure `"moduleResolution": "bundler"` is set; verify Prisma client types are accessible
  - [~] 6.3 Update `.env.local` — add DATABASE_URL, NEXT_PUBLIC_APP_URL; keep NEXTAUTH_SECRET, NEXTAUTH_URL; add commented-out optional Redis vars
  - [~] 6.4 Update `package.json` — add convenience scripts: `"db:migrate"`, `"db:seed"`, `"db:studio"`, `"postinstall": "prisma generate"`
  - _Requirements: 1.5, 14.1, 15.1_

- [ ] 7. Fix Existing Bugs and Code Issues
  - [~] 7.1 Audit all import statements across pages for unused or broken imports and fix them
  - [~] 7.2 Verify all shadcn UI components (Badge, Button, Card, Input, Sheet, Breadcrumb, Carousel, Textarea) exist in `src/components/ui/`; add any that are missing using shadcn CLI or manual creation
  - _Requirements: 1.3, 13.2_

- [ ] 8. Testing and Verification
  - [~] 8.1 Run `npm run build` and fix any TypeScript compilation errors
  - [~] 8.2 Start `npm run dev` and verify the home page loads with seeded featured events
  - [~] 8.3 Verify the events discovery page loads categories from the API and displays events with the map
  - [~] 8.4 Verify sign-up creates a user in the database and redirects to sign-in
  - [~] 8.5 Verify sign-in authenticates successfully and the session is established
  - [~] 8.6 Verify the dashboard redirects to sign-in when not authenticated
  - [~] 8.7 Verify RSVP button on event detail page works for authenticated users
  - [~] 8.8 Verify the dashboard My RSVPs page shows the user's RSVPs
  - [~] 8.9 Verify the Create Event form submits and creates a DRAFT event in the database
  - [~] 8.10 Verify the About and Contact pages render without errors
  - _Requirements: 8.1, 8.2, 9.1, 10.1, 3.6, 3.7, 11.1, 6.1, 11.2, 11.6, 12.1, 12.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Tasks 5 and 7 can be executed in parallel (both depend on Task 4)
- Task 6 can be started alongside Task 2 for environment variable setup
- Run `npx prisma studio` after seeding to visually inspect the database state

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "4.10", "4.11", "4.12", "4.13"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "6.1", "6.2", "6.3", "6.4", "7.1", "7.2"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "8.10"] }
  ]
}
```
