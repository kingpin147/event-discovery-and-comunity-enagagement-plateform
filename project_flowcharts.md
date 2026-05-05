# Project Flowcharts

This document visualizes the core workflows and architecture of the **Event Discovery & Community Engagement Platform** using Mermaid diagrams.

---

## 1. User Journey Flow (Guest & Registered)

```mermaid
graph TD
    Start((Start)) --> Home[Home Page]
    Home --> Search[Search/Filter Events]
    Search --> List[Event List/Map View]
    List --> Detail[Event Detail Page]
    
    Detail --> AuthCheck{Is User Logged In?}
    
    AuthCheck -- No --> Login[Sign In / Sign Up]
    Login --> Detail
    
    AuthCheck -- Yes --> Actions[User Actions]
    Actions --> RSVP[Click RSVP]
    Actions --> Fav[Add to Favorites]
    Actions --> Review[Submit Review]
    
    RSVP --> DB[(Update Strapi DB)]
    DB --> Success[Confirmation Message]
    Success --> Dashboard[View in Dashboard]
```

---

## 2. Event Submission & Approval Flow

```mermaid
graph LR
    User[Registered User] --> Form[Fill Event Form]
    Form --> Submit[Submit to API]
    Submit --> Draft[Saved as Draft in Strapi]
    
    Draft --> AdminNotify[Admin Review Panel]
    AdminNotify --> Review{Approve?}
    
    Review -- No --> Rejected[Notify User/Delete]
    Review -- Yes --> Publish[Publish Event]
    
    Publish --> Frontend[Visible on Public Site]
```

---

## 3. System Architecture & Data Flow

```mermaid
graph TD
    subgraph "Frontend (Next.js)"
        UI[User Interface - Shadcn/UI]
        NextAuth[NextAuth.js - Session Management]
        Leaflet[Leaflet.js - Interactive Maps]
    end

    subgraph "Backend (Strapi v5)"
        API[REST API Endpoints]
        Controllers[Custom Controllers - Security]
        Auth[Strapi Auth Provider]
    end

    subgraph "External Services"
        DB[(PostgreSQL - Neon.tech)]
        CDN[Cloudinary - Media Storage]
        Redis[Upstash - Redis Cache]
    end

    UI <--> API
    NextAuth <--> Auth
    API <--> Controllers
    Controllers <--> DB
    API <--> Redis
    API <--> CDN
```

---

## 4. Authentication Logic (NextAuth + Strapi)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant NextAuth
    participant Strapi
    
    User->>Frontend: Enter Email/Password
    Frontend->>NextAuth: Trigger signIn('credentials')
    NextAuth->>Strapi: POST /api/auth/local
    Strapi-->>NextAuth: Return JWT + User Object
    NextAuth-->>NextAuth: Encrypt JWT in Session Cookie
    NextAuth-->>Frontend: Auth Success
    Frontend->>User: Redirect to Dashboard
```

---

> [!TIP]
> These flowcharts are useful for understanding the technical boundaries of the system and how different components interact in real-time.
