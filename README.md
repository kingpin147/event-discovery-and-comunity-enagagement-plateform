# Event Discovery & Community Engagement Platform

A premium, full-stack web application designed to help users find, explore, and participate in local and online events. Featuring an interactive map interface, real-time synchronization, and a complete RSVP system.

## 🌟 Key Features

* **Interactive Map (Leaflet.js)**: Browse events geographically with custom markers and synchronized list view.
* **Dynamic Event Discovery**: Filter by multiple categories, search by keywords, and view featured events.
* **Headless CMS (Strapi v5)**: Manage all content effortlessly with a powerful admin dashboard.
* **Secure Authentication (NextAuth.js)**: Role-based access for Guests, Registered Users, and Admins.
* **RSVP System**: Register for events with a single click and manage them in your personal dashboard.
* **Blazing Performance**: Redis-powered caching (Upstash) and image optimization (Cloudinary).
* **Fully Responsive**: Premium UI designed for mobile, tablet, and desktop using Tailwind CSS and Shadcn/ui.

## 🛠️ Tech Stack

### Frontend

* **Framework**: Next.js 15+ (App Router)
* **Styling**: Tailwind CSS & Shadcn/ui
* **Authentication**: NextAuth.js
* **Maps**: Leaflet.js
* **Caching**: Upstash Redis

### Backend

* **CMS**: Strapi v5
* **Database**: PostgreSQL (Neon.tech)
* **Media Hosting**: Cloudinary

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm / yarn / pnpm

### 1. Backend Setup (Strapi)

```bash
cd backend
npm install
# Configure your .env file with Neon.tech and Cloudinary credentials
npm run dev
```

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
# Configure your .env.local with Strapi URL and Upstash Redis credentials
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=your_neon_postgres_url
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
NEXTAUTH_SECRET=your_random_secret
```

---

## 📂 Project Structure

```text
├── backend/            # Strapi v5 Headless CMS
│   ├── src/api/        # Event, Category, and RSVP models
│   └── config/         # Database and Plugin configurations
└── frontend/           # Next.js 15+ Frontend
    ├── src/app/        # Pages and Routes
    ├── src/components/ # UI and Logic components
    └── src/lib/        # Utilities (Strapi fetch, Redis client)
```

---

## 📜 Documentation

For more detailed information, please refer to:

* [Implementation Plan](./implementation.md)
* [Project Instructions](./projectInstruction.md)
* [Viva Preparation Guide](./viva_guide.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
