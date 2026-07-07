# Viva Guide

This guide covers the current unified event platform and the main concepts you should be ready to explain.

## 1. Project overview

Q: What is the main goal of this project?
A: The project is a community event platform where users can discover events, view details, RSVP, save favorites, and manage their event-related activity.

Q: What are the core user roles?
A: Guest users can browse public content, registered users can interact with events and dashboard features, and admins can manage moderation and users.

## 2. Frontend stack

Q: Why was Next.js chosen?
A: It provides a modern React-based app structure with server-rendered pages, route-based organization, and built-in API support.

Q: How is styling handled?
A: Tailwind CSS and shadcn/ui are used for a modern, responsive interface.

## 3. Backend and data layer

Q: What database solution is used?
A: Prisma is used with SQLite for local development and can be switched to PostgreSQL for production.

Q: What is the role of NextAuth?
A: NextAuth handles user sign-in, session management, and protected routes.

## 4. Important features

Q: What features are available to users?
A: Users can browse events, filter by category, search by keyword, RSVP, save favorites, and submit events.

Q: What features are available to admins?
A: Admins can moderate events and manage user roles from dedicated admin interfaces.

## 5. Architecture questions

Q: How is the project structured?
A: The app is organized as a single Next.js application with pages under src/app, reusable UI in src/components, shared logic in src/lib, and database models in prisma/.

Q: How does the app handle event data?
A: Event data is stored in the Prisma database and served through internal route handlers under src/app/api.

## 6. Final viva tip

Focus on explaining the architecture, user flows, and why the chosen tools fit the project. Mention that the current version is a unified single-app solution rather than a separate frontend/backend split.
