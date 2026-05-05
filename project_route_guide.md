# Project Page and Route Guide

This document provides a comprehensive overview of all pages and routes within the **Event Discovery & Community Engagement Platform**, covering both the Next.js Frontend and the Strapi Backend.

---

## 🌐 Frontend (Next.js - App Router)

The frontend is built with **Next.js 15**, utilizing the **App Router** for navigation and **NextAuth.js** for authentication.

### 1. Public Pages

| Route | File Path | Description |
| :--- | :--- | :--- |
| **Home** (`/`) | `src/app/page.tsx` | Landing page with search, featured events, and stats. |
| **Events List** (`/events`) | `src/app/events/page.tsx` | Searchable directory of all events with map integration. |
| **Event Details** (`/events/[slug]`) | `src/app/events/[slug]/page.tsx` | Full event info, RSVP button, and interactive map. |
| **About Us** (`/about`) | `src/app/about/page.tsx` | Platform mission, core values, and community stats. |
| **Contact Us** (`/contact`) | `src/app/contact/page.tsx` | Support contact info and message submission form. |

### 2. Authentication Pages

| Route | File Path | Description |
| :--- | :--- | :--- |
| **Sign In** (`/auth/signin`) | `src/app/auth/signin/page.tsx` | Login portal for existing users. |
| **Sign Up** (`/auth/signup`) | `src/app/auth/signup/page.tsx` | Registration page for new community members. |

### 3. Private Dashboard (User Area)

All routes under `/dashboard` require authentication.

| Route | File Path | Description |
| :--- | :--- | :--- |
| **My RSVPs** (`/dashboard`) | `src/app/dashboard/page.tsx` | Overview of events the user is registered for. |
| **Create Event** (`/dashboard/create-event`) | `src/app/dashboard/create-event/page.tsx` | Form to submit new events for admin approval. |
| **Favorites** (`/dashboard/favorites`) | `src/app/dashboard/favorites/page.tsx` | List of events bookmarked by the user. |
| **Profile** (`/dashboard/profile`) | `src/app/dashboard/profile/page.tsx` | Manage account details and view personal stats. |
| **Settings** (`/dashboard/settings`) | Placeholder | General account and notification preferences. |

---

## ⚙️ Backend (Strapi - Headless CMS)

The backend provides the API and content management system.

### 1. Core API Endpoints

| Resource | Route | Purpose |
| :--- | :--- | :--- |
| **Events** | `/api/events` | Fetching and submitting event data. |
| **Categories** | `/api/categories` | Fetching event groupings for filters. |
| **RSVPs** | `/api/rsvps` | Managing event registrations. |
| **Users** | `/api/users/me` | Fetching the current authenticated user's profile. |

### 2. Authentication Endpoints

| Purpose | Route | Description |
| :--- | :--- | :--- |
| **Login** | `/api/auth/local` | Standard username/email and password login. |
| **Register** | `/api/auth/local/register` | Creating a new user account. |

---

## 🔄 Interaction Summary

1. **Public Browsing**: Guests can view all events and informational pages (`/`, `/events`, `/about`, `/contact`).
2. **Joining the Community**: Users register via `/auth/signup` and login via `/auth/signin`.
3. **Taking Action**: Registered users can RSVP to events on the `/events/[slug]` page and manage their activity via the `/dashboard`.
4. **Content Creation**: Users submit events via `/dashboard/create-event`, which appear in the Strapi Admin Panel for approval.

---

> [!NOTE]
> All pages are fully responsive and styled with a premium design system using Tailwind CSS and Shadcn UI components.
