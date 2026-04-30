# Event Discovery & Community Engagement Platform - Viva Guide

This guide provides a comprehensive list of questions and answers related to the project's technology stack, architecture, and implementation details. It is designed to help you prepare for a viva voce or technical interview.

---

## 1. General Project Overview

### Q: What is the main objective of this project?

**A:** The objective is to create a dynamic platform where users can discover local and online events through an interactive map and list view. It bridges the gap between organizers and attendees by providing real-time data, category-based filtering, and a seamless RSVP system.

### Q: What are the three core roles in your system?

**A:**

1. **Guest User:** Can browse events, search, and view details.
2. **Registered User:** Can do everything a guest does, plus RSVP for events and manage their profile.
3. **Administrator:** Manages all content (Events, Categories, Users) through the Strapi CMS dashboard.

---

## 2. Frontend Technology Stack (Next.js)

### Q: Why did you choose Next.js for the frontend?

**A:** Next.js was chosen for its **App Router** architecture, which provides excellent performance through Server Components. Key features used include:

* **Server-Side Rendering (SSR):** For SEO and fast initial loads.
* **Client Components:** For interactive elements like the Leaflet map and search bars.
* **Built-in Routing:** Simplifies dynamic routes like `/events/[slug]`.

### Q: What is TypeScript, and why use it over plain JavaScript?

**A:** TypeScript is a superset of JavaScript that adds **static typing**. It helps catch errors during development (compile-time) rather than at runtime, making the codebase more maintainable and robust.

### Q: How do you handle styling in this project?

**A:** We use **Tailwind CSS**. It is a utility-first CSS framework that allows for rapid UI development directly within HTML/JSX. It ensures a highly responsive design and reduces the final CSS bundle size through "tree-shaking."

### Q: What is Shadcn/ui?

**A:** Shadcn/ui is a collection of re-usable components built with **Radix UI** and **Tailwind CSS**. Unlike traditional component libraries, you "own" the code as it's copied directly into your project, allowing for maximum customization.

---

## 3. Backend Technology Stack (Strapi & Database)

### Q: What is Strapi, and why is it called a "Headless CMS"?

**A:** Strapi is an open-source **Headless Content Management System**. It is "headless" because it focuses solely on managing content and providing it via an API (REST or GraphQL), without being tied to a specific frontend. This allows us to use Next.js for the presentation layer.

### Q: Which database are you using, and how is it connected?

**A:** We use **PostgreSQL** (hosted on **Neon.tech**). It is a powerful, open-source relational database. Strapi connects to it using a connection string stored in the environment variables.

### Q: How do you handle media uploads (images)?

**A:** We use **Cloudinary**. Strapi is configured with a Cloudinary provider plugin so that any image uploaded through the dashboard is automatically hosted on Cloudinary's global CDN, ensuring fast image delivery and optimization.

---

## 4. Database Modeling & Relationships

### Q: Explain the Database Schema of your project

**A:** The database consists of three primary collections:

1. **Event**: Stores event details like title, date, address, and coordinates.
2. **Category**: Stores types of events (Music, Tech, etc.).
3. **RSVP**: Tracks which user is attending which event.

### Q: What are the relationships between these tables?

**A:**

* **Event & Category**: A *Many-to-One* relationship. Many events can belong to one category (e.g., multiple concerts under "Music").
* **Event & RSVP**: A *One-to-Many* relationship. One event can have many RSVPs.
* **User & RSVP**: A *One-to-Many* relationship. One user can RSVP to many events.

### Q: What is a "Slug" in your database and why is it important?

**A:** A slug is a URL-friendly version of a title (e.g., "Summer Music Festival" becomes "summer-music-festival"). We use it in the URL instead of an ID (`/events/summer-music-festival`) to make the links more readable and better for SEO (Search Engine Optimization).

---

## 5. User Flows & Permissions

### Q: Walk me through the "Guest User" flow

**A:**

1. The guest lands on the **Home** page and sees featured events.
2. They navigate to the **Events** discovery page.
3. They use the **Search** or **Category Filter** to find something interesting.
4. They click on an event to see the **Detail Page**.
5. If they try to **RSVP**, the system redirects them to the **Login** page because RSVPs are restricted to registered users.

### Q: Walk me through the "Administrator" flow

**A:**

1. The Admin logs into the **Strapi Dashboard** (`/admin`).
2. They can **Create a Category** (e.g., "Art").
3. They **Create an Event**, select the category, and upload an image (which goes to Cloudinary).
4. They can check a box to make it a **Featured Event**.
5. Once they click **Publish**, the event immediately becomes visible on the Next.js frontend.

### Q: How do you restrict access to the Dashboard?

**A:** We use **NextAuth.js middleware**. If a user tries to access `/dashboard` without an active session, the middleware automatically intercepts the request and redirects them to the `/auth/signin` page.

---

## 6. The RSVP & Data Flow

### Q: What happens technically when a user clicks the "RSVP" button?

**A:**

1. The **RSVPButton** component first checks if a session exists using `useSession()`.
2. If authenticated, it sends a **POST request** to the Strapi `/api/rsvps` endpoint.
3. The request includes the **JWT token** in the Authorization header for security.
4. Strapi validates the token, creates the RSVP record, and links it to the specific **Event ID** and **User ID**.
5. The frontend then updates the button state to "RSVP Confirmed".

### Q: How does the "Image Upload" flow work from start to finish?

**A:**

1. Admin uploads an image in the Strapi Media Library.
2. The **Strapi Cloudinary Plugin** intercepts the file and uploads it to the Cloudinary cloud.
3. Cloudinary returns a **URL string**.
4. Strapi saves this URL in the PostgreSQL database.
5. When the Next.js frontend fetches the event, it receives the Cloudinary URL and displays it using the `<Image />` component.

---

## 7. Mapping & Interactivity

### Q: Which library is used for the interactive map?

**A:** **Leaflet.js**. It is a lightweight, open-source JavaScript library for mobile-friendly interactive maps. It doesn't require an API key and uses **OpenStreetMap** tiles.

### Q: How is the map synchronized with the event list?

**A:** We use React **state management**. When a user hovers over an event card in the list, its ID is stored in a `hoveredEventId` state. The Map component listens to this state to highlight the corresponding marker and center the view.

---

## 8. Performance & Caching

### Q: What is Redis, and how are you using it?

**A:** Redis is an in-memory data store. We use **Upstash Redis** to cache public API responses from Strapi.

* **Why?** Since the backend (on Render) might go to sleep during inactivity, the Redis cache ensures the frontend can still serve event data instantly without waiting for the backend to "wake up."

### Q: How does Next.js handle image optimization?

**A:** It uses the `<Image />` component. It automatically resizes images, converts them to modern formats (like WebP), and implements **Lazy Loading** (loading images only when they enter the viewport).

---

## 9. Infrastructure & Deployment

### Q: Where is your project hosted?

**A:**

* **Frontend**: Vercel (Optimized for Next.js).
* **Backend**: Render (Host for Strapi Node.js app).
* **Database**: Neon.tech (Serverless PostgreSQL).
* **Cache**: Upstash (Serverless Redis).

### Q: Why did you use this specific stack for hosting?

**A:** Because all these services provide a **generous free tier**, which allowed us to build and deploy a production-grade application with zero hosting costs while maintaining professional features like database backups and CDN delivery.

---

## 10. Advanced Viva Questions (The "Hero" Level)

### Q: What are "Server Components" vs "Client Components" in Next.js?

**A:**

* **Server Components:** Render on the server. They reduce the amount of JavaScript sent to the browser and are great for fetching data (e.g., fetching the event list).
* **Client Components:** Render on the browser. They are used for interactivity (e.g., `useState`, `useEffect`, Leaflet map).

### Q: How would you handle a high volume of events (e.g., 10,000+)?

**A:** I would implement **Server-Side Pagination** or **Infinite Scrolling**. Instead of fetching all 10,000 events at once, the API would return them in chunks (e.g., 20 at a time), significantly reducing load times and memory usage.

### Q: What is the difference between REST and GraphQL?

**A:**

* **REST:** Uses fixed endpoints (e.g., `/api/events`) and returns a predefined data structure.
* **GraphQL:** Allows the client to request exactly the data they need (e.g., "only return the event title and date"), which prevents "over-fetching" and improves performance.

### Q: How do you ensure the website is SEO friendly?

**A:**

1. **Metadata API:** Using Next.js `generateMetadata` to set unique titles and descriptions for every page.
2. **Semantic HTML:** Using tags like `<header>`, `<main>`, `<h1>` correctly.
3. **JSON-LD:** Adding structured data (Schema.org) for events so they appear as "rich results" in Google Search.

---

## Final Tip for Viva

Always explain **WHY** you chose a technology, not just **WHAT** you used. For example: "I used Strapi because it allowed us to decouple the content management from the frontend, making the app more scalable."
