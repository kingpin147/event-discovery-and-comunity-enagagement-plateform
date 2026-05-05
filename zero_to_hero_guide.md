# Zero-to-Hero Developer Guide 🚀

This guide is for anyone who has just received this project and knows nothing about how it works. It will take you from "zero" to being a "hero" who can explain and run the entire system.

---

## 1. What is this project?

It's an **Event Management System**. Think of it like a simplified version of Eventbrite or Meetup.

- **Frontend**: What you see in the browser (Next.js).
- **Backend**: The "Brain" that stores all the data (Strapi).

---

## 2. How to run it for the first time?

### Step A: Install the "Tools"

You need **Node.js** installed on your computer. [Download it here](https://nodejs.org/).

### Step B: Start the Backend (The Brain)

1. Open a terminal (CMD or PowerShell) in the `backend` folder.
2. Type `npm install` and wait.
3. Type `npm run dev`.
4. Go to `http://localhost:1337/admin` and create your first Admin account.

### Step C: Start the Frontend (The Face)

1. Open a **new** terminal in the `frontend` folder.
2. Type `npm install` and wait.
3. Type `npm run dev`.
4. Go to `http://localhost:3000`. You should see the website!

---

## 3. Where is the "Important" Code?

If someone asks you where specific things are, look here:

| Feature | Folder Path | Why? |
| :--- | :--- | :--- |
| **The Map** | `frontend/src/components/events/event-map.tsx` | This contains all the Leaflet.js map logic. |
| **Authentication** | `frontend/src/app/api/auth/` | This handles login/signup via NextAuth. |
| **Pages (URLs)** | `frontend/src/app/` | Every folder here is a different page on the site. |
| **Database Fields** | `backend/src/api/event/content-types/` | Defines what info an event has (date, price, etc.). |
| **Security Logic** | `backend/src/api/rsvp/controllers/` | Ensures users can't see each other's private data. |

---

## 4. How do I change things?

- **Want to add a new Event?** Use the Strapi Admin Panel (`/admin`).
- **Want to change the colors?** Look at `frontend/src/app/globals.css`.
- **Want to change the logo?** It's the `Calendar` icon from `lucide-react`, found in `navbar.tsx`.

---

## 5. The "Big Picture" Concepts (For the Viva)

1. **Next.js**: We use this for the frontend because it's fast and SEO friendly.
2. **Strapi**: We use this because it's a "Headless CMS"—it lets us manage data without writing complex SQL code.
3. **Tailwind CSS**: This is how we made it look "Premium" without writing thousands of lines of CSS.
4. **JWT (JSON Web Token)**: This is the "Secret Key" given to a user when they log in so the server knows who they are.

---

## 6. Common Troubleshooting

- **"Database Error"**: Make sure your `.env` file in the backend has a valid database URL.
- **"Module Not Found"**: You probably forgot to run `npm install`.
- **"Map not showing"**: Check your internet connection (it needs to download map tiles).

---

> [!TIP]
> If you are nervous, just remember: The **Frontend** asks for data, and the **Backend** gives it. Everything else is just styling!
