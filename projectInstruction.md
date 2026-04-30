# Project Proposal

## Project Title

Event Discovery & Community Engagement Platform

## Project Domain / Category

Web Application Development / Event Management System / Community Platform

## Abstract / Introduction

The proposed project is a web-based Event Discovery and Community Engagement Platform designed to help users find, explore, and participate in local and online events such as workshops, concerts, sports meets, cultural festivals, networking sessions, and community volunteering drives. The system provides a dynamic and user-friendly interface where users can browse upcoming events displayed both on an interactive map and in a structured list view, helping them decide which events to attend based on location, interest, and date.

This application bridges the gap between event organizers and attendees by combining geographic visualization with structured event data. Users can filter events by category, view event details including venue, schedule, ticket information, and organizer contact, and RSVP or register directly through the platform. The system can be extended to include user reviews, social sharing, and personalized event recommendations, making it a comprehensive and scalable solution for real-world community engagement.

## Functional Requirements

### FR-01: Interactive Map Display

The system shall display an interactive map interface using a mapping library (such as Leaflet.js or Google Maps API). The map shall load all available events as markers upon page load. Each marker shall be clickable and shall visually distinguish between different event categories using color-coded or icon-based markers. The map shall support zooming, panning, and fitting bounds to show all markers within the viewport.

### FR-02: List View of Events

The system shall provide a structured list view displaying all available events retrieved from the backend API. Each list item shall show the event name, category, thumbnail image, date/time, and a short description. The list shall be paginated or infinitely scrollable to handle large datasets efficiently. The list view and map view shall be synchronized so that hovering or clicking a list item highlights the corresponding marker on the map.

### FR-03: Category-Based Filtering

The system shall provide a filtering mechanism that allows users to filter events by predefined categories such as Music, Sports, Technology, Art & Culture, Food & Drink, Health & Wellness, and Community Service. The filter shall be accessible via a dropdown menu, tab bar, or sidebar panel. Upon selecting a category, both the map markers and the list view shall update dynamically without requiring a full page reload. Multiple category selection shall be supported where applicable.

### FR-04: Event Detail Page

The system shall provide a dedicated detail page for each event, accessible via a unique URL (e.g., /events/:id or /events/:slug). The detail page shall display all available information including the full event name, category, description, venue address, date and time, ticket pricing, organizer contact information, and an embedded mini-map showing the exact event location. The page shall also include a breadcrumb navigation for easy return to the listing page.

### FR-05: Images and Descriptions Display

The system shall display one or more images for each event using an image gallery or carousel component. Images shall be lazily loaded to optimize page performance and reduce initial load time. Each event shall include a short description (used in list and featured views) and a full detailed description displayed on the event detail page. Image alt-text shall be included for accessibility compliance.

### FR-06: Map Marker Highlighting

The system shall visually highlight the map marker of an event when the user selects it from the list view, search results, or featured section. The highlighted marker shall change its icon, size, or color to distinguish it from unselected markers. The map shall automatically pan and center on the selected marker if it is outside the current viewport. A popup or tooltip shall appear displaying the event name, date, and category.

### FR-07: Featured Events Section

The system shall include a dedicated Featured Events section displayed prominently on the homepage or landing page. Featured events shall be manually selected and managed by the admin through the Strapi CMS dashboard. Each featured event card shall display the event name, category, thumbnail image, date, short description, and a "View Details" button linking to the full detail page. The section shall be displayed in a responsive card grid or horizontal scrollable carousel layout.

### FR-08: Search Functionality

The system shall provide a search bar that allows users to search for events by name, category, organizer, or venue keyword. Search queries shall be sent to the backend API, which shall return matching results from the database. Search results shall be displayed in real time or upon submission, updating both the list view and the map markers accordingly. The search bar shall include a clear/reset button to restore the default view. If no results are found, a user-friendly "No results found" message shall be displayed.

### FR-09: Address and Basic Details Display

The system shall display the full address of each event venue including street, city, and region where available. Basic details such as event date, time, category label, ticket price (or 'Free'), and organizer contact shall be visible in both the list card and the detail page. The address shall be formatted consistently across all views and shall optionally include a "Get Directions" link that opens the venue in Google Maps or a native map application.

### FR-10: Responsive Interface

The system shall provide a fully responsive user interface that adapts seamlessly to all screen sizes including mobile phones, tablets, and desktop monitors. The layout shall follow a mobile-first design approach using Tailwind CSS breakpoints. On mobile devices, the map and list view shall be toggled via a tab or floating button rather than displayed side by side. All interactive elements including buttons, filters, and search inputs shall be touch-friendly with appropriate tap target sizes as per accessibility guidelines.

## The Three Core Roles

### Role 1: Guest User (Unauthenticated)

This is any visitor who accesses the application without logging in.

#### Guest User Capabilities

* Browse the interactive map and view all event markers
* View the list of all available upcoming and past events
* Filter events by category, date range, or location
* Use the search functionality to find specific events
* View event detail pages (name, description, images, venue, schedule)
* View the featured events section on the homepage

#### Guest User Restrictions

* RSVP or register for events
* Submit reviews or ratings
* Create or submit new events
* Access any admin or management features

**In Strapi:** This maps to the Public role, which has read-only access to published event data via the API.

### Role 2: Registered User (Authenticated)

This is a visitor who has created an account and logged in via NextAuth.js + Strapi authentication.

#### Registered User Capabilities

* Everything a Guest User can do
* RSVP or register for events and receive confirmations
* Save or bookmark favorite events to their profile
* Submit reviews and ratings for events they have attended
* View their personal profile, RSVP history, and saved events list
* Update their own account information (name, password, profile picture)
* Submit a new event for admin review and approval

#### Registered User Restrictions

* Edit or delete other users' data
* Publish or approve submitted events
* Access the admin dashboard
* Manage categories or system settings

**In Strapi:** This maps to the Authenticated role, which has read access to all public data plus write access to their own user-specific data such as RSVPs, favorites, and reviews.

### Role 3: Administrator (Admin)

This is a trusted internal user who manages all content and system settings through the Strapi CMS admin dashboard.

#### Administrator Capabilities

* Full CRUD (Create, Read, Update, Delete) access to all events
* Add, edit, or remove event images, descriptions, venues, and schedules
* Create, edit, and delete event categories
* Mark or unmark events as 'Featured' for the homepage section
* Manage all registered user accounts (view, activate, deactivate, delete)
* Approve or reject user-submitted event listings
* Manage roles and permissions for other users
* Configure API access and content visibility settings
* Access usage analytics and system logs (if enabled)

#### Administrator Restrictions

* Actions are limited only by system-level server configurations outside Strapi

**In Strapi:** This maps to the Super Admin or a custom Admin role created inside the Strapi admin panel with full collection-level permissions.

## Key Features

* Dynamic event content management via Headless CMS
* User authentication, authorization, and role-based access control
* Fully responsive design across all devices
* SEO optimization with meta tags and structured data
* Image optimization and lazy loading for performance
* Real-time data synchronization between map and list views
* RSVP and event registration with confirmation notifications
* Admin dashboard for complete content and user management

## Tools & Technology Stack

### Frontend Technology Stack

| Component | Technology / Tool |
| :--- | :--- |
| Framework | Next.js 16+ (React-based) |
| Styling | Tailwind CSS / Styled Components |
| State Management | Context API / Redux |
| UI Components | Shadcn/ui / Material-UI |
| Authentication | NextAuth.js |
| Map Library | Leaflet.js |
| Deployment | Vercel / Netlify |

### Backend Technology Stack

| Component | Technology / Tool |
| :--- | :--- |
| CMS | Strapi v5 (Headless CMS) |
| Database | PostgreSQL / MySQL |
| Authentication | Strapi built-in auth + JWT |
| File Storage | Cloudinary / AWS S3 |
| API | RESTful API / GraphQL |
| Deployment | Railway / DigitalOcean / AWS |
