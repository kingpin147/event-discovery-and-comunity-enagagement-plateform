# Route Testing Guide

This guide explains how to test the main routes of the event platform using both a regular user account and an admin account.

## 1. Prerequisites

Before testing, make sure the app is running locally:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open the app at http://localhost:3000.

## 2. Test Accounts

### Regular user account
Use a normal registered account to test protected user-facing routes.

Suggested credentials:
- Email: user@example.com
- Password: password123

### Admin account
Use an admin account to test moderation and management routes.

Suggested credentials:
- Email: admin@example.com
- Password: admin123

> If your local database uses different seeded credentials, update the values to match your environment.

## 3. Public Routes

These routes should be accessible without login.

### Home page
- URL: /
- Expected result: Home page loads with hero content and event sections.
- What to verify:
  - Page renders without errors
  - Featured or recent events are visible
  - Navigation links work

### Events page
- URL: /events
- Expected result: Event listing page loads.
- What to verify:
  - Event cards appear
  - Search and category filters work
  - Map/list toggle works if available

### Event details page
- URL: /events/[slug]
- Expected result: Event detail page loads for an existing event.
- What to verify:
  - Title, description, date, time, and venue display correctly
  - RSVP button is visible
  - Map or location section renders if data exists

### About page
- URL: /about
- Expected result: About page loads correctly.

### Contact page
- URL: /contact
- Expected result: Contact page loads correctly.

## 4. Authentication Routes

### Sign in page
- URL: /auth/signin
- Expected result: Sign-in form loads.
- Test steps:
  1. Enter valid user credentials.
  2. Submit the form.
  3. Confirm the user is redirected to the dashboard or intended page.

### Sign up page
- URL: /auth/signup
- Expected result: Registration form loads.
- Test steps:
  1. Fill in username, email, and password.
  2. Submit the form.
  3. Confirm the account is created successfully and the user can sign in.

## 5. User Routes (Regular User Login)

These routes should be accessible only after logging in as a normal user.

### Dashboard home
- URL: /dashboard
- Expected result: User dashboard page loads.
- What to verify:
  - User-specific data is shown
  - RSVP summary or recent activity appears

### Favorites page
- URL: /dashboard/favorites
- Expected result: List of saved favorite events appears.
- What to verify:
  - Favorites load correctly
  - Remove or view actions work as expected

### Create event page
- URL: /dashboard/create-event
- Expected result: Event creation form loads.
- Test steps:
  1. Fill in the event title, description, date, time, venue, and category.
  2. Submit the form.
  3. Confirm the event is created or saved as expected.

### Profile page
- URL: /dashboard/profile
- Expected result: Profile page loads with account information.
- What to verify:
  - Username and email display correctly
  - Profile fields are editable if supported

### RSVP and favorite behavior
- Test from the event details page:
  - Click RSVP and verify the action updates correctly
  - Click favorite and verify the saved state appears in the dashboard

## 6. Admin Routes (Admin Login)

These routes should be accessible only after logging in as an admin.

### Admin dashboard
- URL: /admin
- Expected result: Admin moderation dashboard loads.
- What to verify:
  - Admin-only content is visible
  - Pending or existing events can be reviewed

### Admin users page
- URL: /admin/users
- Expected result: User management page loads.
- What to verify:
  - User list is displayed
  - Role management actions work if supported

### Admin event moderation
- From the admin dashboard, test:
  - Viewing submitted events
  - Approving, rejecting, or updating event status if the UI supports it

## 7. API Route Testing Notes

You can also test the backend routes directly with tools like Postman or curl.

### Public API
- GET /api/events
- GET /api/categories

### Auth API
- POST /api/auth/register
- POST /api/auth/[...nextauth]

### User-protected API
- GET /api/rsvps
- GET /api/favorites
- POST /api/events

### Admin-protected API
- Admin endpoints should return access errors for non-admin users and succeed for admin users.

## 8. Expected Results Summary

### For a regular user
- Can access public pages
- Can sign in successfully
- Can open dashboard pages
- Can RSVP and save favorites
- Cannot access admin pages

### For an admin
- Can access public pages
- Can sign in successfully
- Can open dashboard and admin pages
- Can manage events and user roles

## 9. Common Issues to Check

- Redirect loops after login
- Access denied errors on protected routes
- Missing session after refresh
- Form submission failures
- Admin routes visible to non-admin users
- Broken navigation links or invalid route pages

## 10. Final Testing Checklist

- [ ] Public routes load without login
- [ ] User login works
- [ ] User dashboard routes work
- [ ] RSVP and favorite actions work
- [ ] Admin login works
- [ ] Admin routes work
- [ ] Non-admin users cannot access admin routes
- [ ] Forms submit successfully
