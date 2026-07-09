# Strapi backend companion

This folder contains the optional Strapi backend for the event platform. The main application and user-facing experience live in the repository root, while this folder can be used for CMS-style content management or future backend extensions.

## What this folder is for

- Manage content and admin workflows separately from the Next.js frontend
- Provide a Strapi-based API if a CMS backend is needed later
- Keep the main app focused on the event discovery experience

## Project structure

- config/ — server, database, middleware, and plugin configuration
- src/api/ — API endpoints and content-types
- src/extensions/ — plugin extensions and customizations
- public/ — uploaded assets and public files

## Quick start

```bash
cd strapi-backend
npm install
npm run develop
```

The Strapi admin panel will be available after the server starts.

## Notes

- The core event platform uses Prisma in the repository root for event, user, RSVP, favorite, and review data.
- Strapi is optional and does not replace the main Next.js application.
- Use this backend when you want a content-management experience or additional admin APIs.
