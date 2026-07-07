# Requirements Document

## Introduction

Migrate the current two-project setup (Strapi backend + Next.js frontend) into a single, self-contained Next.js application. The unified app replaces Strapi with Next.js API routes, replaces the external PostgreSQL dependency with an embedded Prisma + SQLite database (dev) / PostgreSQL (prod), and keeps all existing frontend features intact. The result is one `npm run dev` command that runs the entire platform.

## Glossary

- **Unified_App**: The single Next.js application that combines the API layer and frontend, replacing the separate Strapi backend and Next.js frontend projects.
- **Prisma**: The ORM (Object-Relational Mapper) used to interact with the database through a type-safe schema.
- **NextAuth**: The authentication library used to manage sessions and credentials within the Next.js application.
- **API_Route**: A Next.js server-side endpoint defined under `src/app/api/` that handles HTTP requests.
- **User**: A registered account with a role of GUEST, USER, or ADMIN.
- **Event**: A platform entry representing a real-world event with metadata such as title, date, venue, and status.
- **Category**: A classification label applied to Events to enable filtering.
- **RSVP**: A record linking a User to an Event to indicate intent to attend.
- **Favorite**: A record linking a User to an Event to bookmark it for later.
- **Seed_Script**: A script (`prisma/seed.ts`) that populates the database with initial sample data.
- **Dashboard**: The authenticated section of the app at `/dashboard/*` where users manage RSVPs, Favorites, Events, and Profile.
- **Redis**: An optional in-memory cache used to reduce database load for public data.
- **Cloudinary**: An external image hosting service whose domains must be permitted in Next.js image configuration.
- **JWT**: JSON Web Token — the signed token stored in the NextAuth session containing user identity and role.
- **Slug**: A URL-friendly string identifier derived from an entity's title, used in API routes and page URLs.

## Requirements

### Requirement 1: Single-Project Structure

**User Story:** As a developer, I want a single Next.js project containing both the API and frontend so I can run and deploy one application instead of two.

#### Acceptance Criteria

1. THE Unified_App SHALL use the existing `frontend/` directory as the project root.
2. THE Unified_App SHALL contain a `prisma/` folder with the database schema and migrations.
3. THE Unified_App SHALL expose all backend functionality through Next.js API_Routes under `src/app/api/`, replacing the Strapi `backend/` folder.
4. WHEN a developer runs `npm run dev` from the project root, THE Unified_App SHALL start the full application including frontend, API, and database access.
5. THE Unified_App SHALL read all environment variables from a single `.env.local` file.

---

### Requirement 2: Database Layer (Prisma ORM)

**User Story:** As a developer, I want an embedded database layer so the app works without a separate Strapi or PostgreSQL server.

#### Acceptance Criteria

1. THE Prisma configuration SHALL use SQLite as the default database provider for local development.
2. THE Prisma schema SHALL define a `User` model with fields: id, username, email, password (hashed), role (GUEST | USER | ADMIN), createdAt.
3. THE Prisma schema SHALL define an `Event` model with fields: id, title, slug, description, date, time, venueAddress, coordinatesLat, coordinatesLng, ticketPrice, featured, imageUrl, status (DRAFT | PUBLISHED), createdAt, updatedAt.
4. THE Prisma schema SHALL define a `Category` model with fields: id, name, slug, color, icon.
5. THE Prisma schema SHALL define an `RSVP` model with fields: id, userId, eventId, createdAt, and a unique constraint on the (userId, eventId) pair.
6. THE Prisma schema SHALL define a `Favorite` model with fields: id, userId, eventId, createdAt, and a unique constraint on the (userId, eventId) pair.
7. THE Prisma schema SHALL define relations: Event to Category (many-to-one), Event to RSVP (one-to-many), Event to Favorite (one-to-many), User to Event (one-to-many as organizer), User to RSVP (one-to-many), User to Favorite (one-to-many).
8. THE Seed_Script SHALL populate sample Categories and Events so the application functions immediately after the first run.
9. THE Prisma client SHALL read the database connection from the `DATABASE_URL` environment variable.

---

### Requirement 3: Authentication System

**User Story:** As a user, I want to register an account and log in so I can RSVP for events and access my dashboard.

#### Acceptance Criteria

1. THE NextAuth configuration SHALL use a `CredentialsProvider` that authenticates against the local Prisma `User` table.
2. WHEN a user registers, THE Unified_App SHALL hash the password with `bcryptjs` before storing it, and SHALL compare the hashed value on login.
3. WHEN a `POST /api/auth/register` request is received with valid data, THE API_Route SHALL create a new `User` record with role `USER` and return the user data.
4. THE JWT SHALL include the authenticated user's `id`, `email`, `username`, and `role`.
5. WHEN an unauthenticated request is made to a `/dashboard/*` route, THE Unified_App SHALL redirect the user to `/auth/signin`.
6. THE sign-in page at `/auth/signin` SHALL authenticate users via the CredentialsProvider.
7. THE sign-up page at `/auth/signup` SHALL submit registration data to `POST /api/auth/register`.

---

### Requirement 4: Events API

**User Story:** As any user, I want to browse and search events via a fast API so the UI can fetch and display data.

#### Acceptance Criteria

1. WHEN a `GET /api/events` request is received, THE API_Route SHALL return a paginated list of PUBLISHED events supporting optional query parameters: `search`, `category`, `page`, and `limit`.
2. WHEN a `GET /api/events/[slug]` request is received, THE API_Route SHALL return a single event by slug including its Category and RSVP count.
3. WHEN an authenticated USER submits a `POST /api/events` request, THE API_Route SHALL create a new Event with status `DRAFT` and record the authenticated user as organizer.
4. WHEN an authenticated owner or ADMIN submits a `PUT /api/events/[slug]` request, THE API_Route SHALL update the specified Event.
5. WHEN an authenticated owner or ADMIN submits a `DELETE /api/events/[slug]` request, THE API_Route SHALL delete the specified Event.
6. WHEN an authenticated ADMIN submits a `PATCH /api/events/[slug]/publish` request, THE API_Route SHALL change the Event status to PUBLISHED.
7. THE API_Route SHALL return list responses in the shape: `{ data: [...], meta: { pagination: { page, pageSize, total } } }`.
8. THE API_Route SHALL return appropriate HTTP status codes and descriptive error messages for all failure cases.

---

### Requirement 5: Categories API

**User Story:** As a user, I want events to be organised into categories so I can filter by interest.

#### Acceptance Criteria

1. WHEN a `GET /api/categories` request is received, THE API_Route SHALL return all Categories without requiring authentication.
2. WHEN an authenticated ADMIN submits a `POST /api/categories` request, THE API_Route SHALL create a new Category.
3. WHEN an authenticated ADMIN submits a `PUT /api/categories/[slug]` request, THE API_Route SHALL update the specified Category.
4. WHEN an authenticated ADMIN submits a `DELETE /api/categories/[slug]` request, THE API_Route SHALL delete the specified Category.

---

### Requirement 6: RSVP API

**User Story:** As a registered user, I want to RSVP for an event so the system knows I plan to attend.

#### Acceptance Criteria

1. WHEN an authenticated user submits a `POST /api/rsvps` request with a valid `eventId`, THE API_Route SHALL create an RSVP record linking the user to that Event.
2. IF an RSVP already exists for the (userId, eventId) pair, THEN THE API_Route SHALL return HTTP 409.
3. WHEN an authenticated owner submits a `DELETE /api/rsvps/[id]` request, THE API_Route SHALL remove the specified RSVP.
4. WHEN an authenticated user sends a `GET /api/rsvps/my` request, THE API_Route SHALL return all RSVPs for that user with populated Event data.
5. WHEN a `GET /api/events/[slug]` request is received, THE API_Route SHALL include `rsvpCount` in the response and, WHERE a session is present, SHALL include a `userHasRSVPed` boolean.

---

### Requirement 7: Favorites API

**User Story:** As a registered user, I want to save events to a favorites list so I can revisit them later.

#### Acceptance Criteria

1. WHEN an authenticated user submits a `POST /api/favorites` request with a valid `eventId`, THE API_Route SHALL add the Event to the user's Favorites.
2. IF a Favorite already exists for the (userId, eventId) pair, THEN THE API_Route SHALL return HTTP 409.
3. WHEN an authenticated owner submits a `DELETE /api/favorites/[id]` request, THE API_Route SHALL remove the specified Favorite.
4. WHEN an authenticated user sends a `GET /api/favorites/my` request, THE API_Route SHALL return all Favorites for that user with populated Event data.

---

### Requirement 8: Home Page

**User Story:** As a guest or registered user, I want to see featured events and a search bar on the home page so I can quickly find something interesting.

#### Acceptance Criteria

1. THE home page SHALL display a hero section containing a search form.
2. THE home page SHALL display a "Featured Events" section showing Events where `featured = true`, fetched from the database server-side.
3. WHEN a user submits the search form, THE Unified_App SHALL navigate to `/events?search=<query>`.
4. THE home page SHALL display a stats/features section covering Diverse Events, Active Community, and Interactive Maps.
5. THE home page SHALL display a newsletter or CTA section.
6. THE home page SHALL be implemented as a Next.js Server Component that fetches featured Events during server-side rendering.

---

### Requirement 9: Events Discovery Page

**User Story:** As any user, I want to browse all events on a page with a map and list view, and filter by category or search term.

#### Acceptance Criteria

1. THE `/events` page SHALL display a split-screen layout with the event list occupying 60% of the width and the Leaflet map occupying 40% of the width on desktop viewports.
2. WHILE on a mobile viewport, THE `/events` page SHALL allow the user to toggle between the list view and the map view using a floating button.
3. THE `/events` page SHALL fetch Categories from `GET /api/categories` and render them as filter badges.
4. WHEN a user selects a category badge, THE `/events` page SHALL filter both the event list and the map markers without performing a full page reload.
5. WHEN a user types in the search input, THE `/events` page SHALL filter events matching the title or venue address.
6. WHEN a user hovers over an event card, THE `/events` page SHALL highlight the corresponding map marker and center the map on that Event.
7. WHEN a user clicks "Load More Events", THE `/events` page SHALL fetch the next page of Events and append them to the existing list.
8. WHEN filters return no results, THE `/events` page SHALL display a "No events found" empty state.
9. THE `/events` page SHALL fetch initial Categories and Events from the internal API endpoints.

---

### Requirement 10: Event Detail Page

**User Story:** As any user, I want to see full details of an event, including a map of the venue and an RSVP option.

#### Acceptance Criteria

1. WHEN a user navigates to `/events/[slug]`, THE Unified_App SHALL fetch the Event data from `GET /api/events/[slug]`.
2. THE Event detail page SHALL display the title, category, date, time, ticket price, full description, venue address, and event image.
3. THE Event detail page SHALL render a mini Leaflet map showing the Event's exact coordinates.
4. THE Event detail page SHALL display a "Get Directions" link that opens Google Maps with the venue address pre-filled.
5. WHEN an unauthenticated user clicks the RSVP button, THE Unified_App SHALL redirect the user to the sign-in page.
6. WHEN an authenticated user clicks the RSVP button, THE Unified_App SHALL call `POST /api/rsvps` and update the button label to "RSVP Confirmed".
7. THE Event detail page SHALL display the RSVP count as "X People are going", fetched from the API.
8. THE Event detail page SHALL display breadcrumb navigation in the order: Home → Events → Event Title.
9. THE Event detail page SHALL include SEO metadata (title and description) generated via `generateMetadata`.

---

### Requirement 11: User Dashboard

**User Story:** As a registered user, I want a personal dashboard where I can manage my RSVPs, favorites, profile, and submit events.

#### Acceptance Criteria

1. WHILE on a `/dashboard/*` route, THE Dashboard SHALL verify the session and redirect unauthenticated users to sign-in.
2. THE `/dashboard` page SHALL fetch and display the user's RSVPs from `GET /api/rsvps/my`.
3. WHEN a user clicks "Cancel RSVP" on an RSVP card, THE Dashboard SHALL call `DELETE /api/rsvps/[id]` and remove the entry from the list.
4. THE `/dashboard/favorites` page SHALL fetch and display the user's Favorites from `GET /api/favorites/my`.
5. WHEN a user clicks "Remove" on a Favorite entry, THE Dashboard SHALL call `DELETE /api/favorites/[id]` and remove the entry from the list.
6. WHEN a user submits the create-event form on `/dashboard/create-event`, THE Dashboard SHALL call `POST /api/events` and display a success message on completion.
7. THE `/dashboard/profile` page SHALL display the current user's username and email from the session.
8. THE Dashboard SHALL display meaningful empty states on all sections when no data is present.

---

### Requirement 12: About and Contact Pages

**User Story:** As any user, I want informational pages about the platform so I understand the mission and can get support.

#### Acceptance Criteria

1. THE `/about` page SHALL display the platform mission, statistics (events hosted, users, cities, organizers), and core values: Inclusivity, Accessibility, Safety, and Innovation.
2. THE `/contact` page SHALL display contact details and a form.
3. WHEN a user submits the contact form, THE `/contact` page SHALL display a success confirmation message.

---

### Requirement 13: Responsive Interface

**User Story:** As a mobile user, I want the application to work well on my phone so I can browse events on the go.

#### Acceptance Criteria

1. THE Unified_App SHALL render all pages usably on screens from 320px wide and wider.
2. THE Unified_App SHALL collapse the navbar to a hamburger menu on mobile viewports.
3. THE `/events` page SHALL toggle between list view and map view on mobile using a floating button.
4. THE Unified_App SHALL render all tap targets (buttons and links) at a minimum size of 44×44px.
5. THE Dashboard sidebar SHALL collapse or convert to a top navigation bar on mobile viewports.

---

### Requirement 14: Image Handling

**User Story:** As an admin or organizer, I want event images to be displayed optimally so the app loads fast and looks good.

#### Acceptance Criteria

1. THE `next.config.ts` SHALL configure `images.remotePatterns` to allow Cloudinary image domains used by existing event data.
2. THE Unified_App SHALL render all event images using the Next.js `<Image />` component for automatic optimization and lazy loading.
3. WHEN no image URL is present for an Event, THE Unified_App SHALL display a styled placeholder containing a Calendar icon.
4. THE Unified_App SHALL always set the `alt` attribute of event images to the event title.

---

### Requirement 15: Caching (Optional / Graceful Degradation)

**User Story:** As a developer, I want Redis caching to be optional so the app works without Upstash credentials configured.

#### Acceptance Criteria

1. WHERE `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` environment variables are empty, THE Redis client SHALL return `null` for all cache reads and perform no-ops for all cache writes.
2. WHEN a GET request is processed, THE `fetchApi` helper SHALL attempt a cache read first; IF the cache returns null, THEN THE helper SHALL proceed to query the database.
3. THE Redis client SHALL apply a TTL of 3600 seconds (1 hour) to cached public Event and Category data.
4. THE RSVP and Favorites API_Routes SHALL bypass the cache entirely.
