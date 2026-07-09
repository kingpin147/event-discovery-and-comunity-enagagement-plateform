# Project Page and Route Guide

This guide maps the main Next.js application and the optional Strapi backend companion in the repository.

## Public pages

| Route | File | Purpose |
| :--- | :--- | :--- |
| / | src/app/page.tsx | Home page with hero content, featured events, and CTA sections |
| /events | src/app/events/page.tsx | Event discovery page with search, filters, and map/list view |
| /events/[slug] | src/app/events/[slug]/page.tsx | Event detail page with map, RSVP, and review content |
| /about | src/app/about/page.tsx | Information about the platform |
| /contact | src/app/contact/page.tsx | Contact information and support form |

## Authentication pages

| Route | File | Purpose |
| :--- | :--- | :--- |
| /auth/signin | src/app/auth/signin/page.tsx | Sign-in experience for existing users |
| /auth/signup | src/app/auth/signup/page.tsx | Registration page for new users |

## Dashboard routes

All dashboard pages require an authenticated session.

| Route | File | Purpose |
| :--- | :--- | :--- |
| /dashboard | src/app/dashboard/page.tsx | User overview with RSVPs |
| /dashboard/favorites | src/app/dashboard/favorites/page.tsx | Saved favorite events |
| /dashboard/create-event | src/app/dashboard/create-event/page.tsx | Form to submit a new event |
| /dashboard/profile | src/app/dashboard/profile/page.tsx | User profile and account information |

## Admin routes

| Route | File | Purpose |
| :--- | :--- | :--- |
| /admin | src/app/admin/page.tsx | Event moderation dashboard |
| /admin/users | src/app/admin/users/page.tsx | User management and role controls |

## API routes

| Route | File | Purpose |
| :--- | :--- | :--- |
| /api/events | src/app/api/events/route.ts | List and create events |
| /api/events/[slug] | src/app/api/events/[slug]/route.ts | Read, update, or delete one event |
| /api/categories | src/app/api/categories/route.ts | List and create categories |
| /api/rsvps | src/app/api/rsvps/route.ts | Create or list RSVPs |
| /api/favorites | src/app/api/favorites/route.ts | Create or list favorites |
| /api/upload | src/app/api/upload/route.ts | Upload event images |
| /api/auth/register | src/app/api/auth/register/route.ts | User registration |
| /api/auth/[...nextauth] | src/app/api/auth/[...nextauth]/route.ts | Sign-in and session handling |

## Optional Strapi backend

The Strapi project lives in strapi-backend/ and can be used for CMS-style content management or future extension work. It is separate from the main Next.js application and does not replace the Prisma-backed event data layer.

## Interaction summary

1. Visitors browse the home and events pages.
2. Users register or sign in to access dashboard features.
3. Authenticated users can RSVP, save favorites, and submit events.
4. Admins can review moderation queues and manage user roles from the admin pages.
