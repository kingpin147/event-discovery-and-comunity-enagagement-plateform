/**
 * Client-side fetch helpers for internal Next.js API routes.
 * All functions throw on non-2xx responses with the server's error message.
 */

import type { Event, RSVP, Favorite, PaginatedResponse, Category } from '@/types';

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error?.message ?? body?.message ?? message;
    } catch {
      // ignore JSON parse failures
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export interface GetEventsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

/** GET /api/events — fetch a paginated list of events */
export async function getEvents(
  params?: GetEventsParams
): Promise<{ data: Event[]; meta: PaginatedResponse<Event>['meta'] }> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.category) qs.set('category', params.category);
  if (params?.page != null) qs.set('page', String(params.page));
  if (params?.limit != null) qs.set('limit', String(params.limit));

  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch<{ data: Event[]; meta: PaginatedResponse<Event>['meta'] }>(
    `/api/events${query}`
  );
}

/** GET /api/events/[slug] — fetch a single event by slug */
export async function getEvent(slug: string): Promise<{ data: Event }> {
  return apiFetch<{ data: Event }>(`/api/events/${encodeURIComponent(slug)}`);
}

/** POST /api/events — create a new event (auth required) */
export async function createEvent(data: Partial<Event>): Promise<{ data: Event }> {
  return apiFetch<{ data: Event }>('/api/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// RSVPs
// ---------------------------------------------------------------------------

/** GET /api/rsvps/my — fetch current user's RSVPs */
export async function getMyRSVPs(): Promise<{ data: RSVP[] }> {
  return apiFetch<{ data: RSVP[] }>('/api/rsvps/my');
}

/** POST /api/rsvps — RSVP to an event */
export async function createRSVP(eventId: number): Promise<{ data: RSVP }> {
  return apiFetch<{ data: RSVP }>('/api/rsvps', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
  });
}

/** DELETE /api/rsvps/[id] — cancel an RSVP */
export async function deleteRSVP(id: number): Promise<void> {
  await apiFetch<unknown>(`/api/rsvps/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------

/** GET /api/favorites/my — fetch current user's favorites */
export async function getMyFavorites(): Promise<{ data: Favorite[] }> {
  return apiFetch<{ data: Favorite[] }>('/api/favorites/my');
}

/** POST /api/favorites — save an event as a favorite */
export async function createFavorite(eventId: number): Promise<{ data: Favorite }> {
  return apiFetch<{ data: Favorite }>('/api/favorites', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
  });
}

/** DELETE /api/favorites/[id] — remove a favorite */
export async function deleteFavorite(id: number): Promise<void> {
  await apiFetch<unknown>(`/api/favorites/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/** GET /api/categories — fetch all categories */
export async function getCategories(): Promise<{ data: Category[] }> {
  return apiFetch<{ data: Category[] }>('/api/categories');
}
