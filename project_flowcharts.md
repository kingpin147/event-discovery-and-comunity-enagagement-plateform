# Project Flowcharts

This document summarizes the current workflows of the unified event platform.

## 1. User journey flow

```mermaid
graph TD
    Start((Start)) --> Home[Home page]
    Home --> Explore[Browse events]
    Explore --> Detail[Open event details]
    Detail --> AuthCheck{Logged in?}
    AuthCheck -- No --> SignIn[Sign in or sign up]
    SignIn --> Detail
    AuthCheck -- Yes --> Actions[RSVP / Favorite / Review]
    Actions --> Dashboard[View in dashboard]
```

## 2. Event submission flow

```mermaid
graph LR
    User[Registered user] --> Form[Fill create-event form]
    Form --> Submit[POST /api/events]
    Submit --> Draft[Event saved as draft]
    Draft --> Admin[Admin moderation view]
    Admin --> Publish[Publish event]
    Publish --> Public[Visible on site]
```

## 3. Current system architecture

```mermaid
graph TD
    subgraph Frontend
        UI[Next.js pages and components]
        Auth[NextAuth session handling]
        Maps[Leaflet map UI]
    end

    subgraph API
        Routes[Route handlers under src/app/api]
        Prisma[Prisma client]
    end

    subgraph Data
        DB[(SQLite for local dev)]
        Seed[Seed data]
    end

    UI <--> Routes
    Auth <--> Routes
    Maps <--> Routes
    Routes <--> Prisma
    Prisma <--> DB
    Seed --> DB
```

## 4. Authentication flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant NextAuth
    participant Prisma

    User->>Frontend: Submit sign-in form
    Frontend->>NextAuth: Authenticate credentials
    NextAuth->>Prisma: Validate user record
    Prisma-->>NextAuth: Return user details
    NextAuth-->>Frontend: Session created
    Frontend->>User: Redirect to dashboard
```
