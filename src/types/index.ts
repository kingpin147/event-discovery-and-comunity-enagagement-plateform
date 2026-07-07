// ---------------------------------------------------------------------------
// Primitive types matching the Prisma schema (SQLite string-based enums)
// ---------------------------------------------------------------------------

export type EventStatus = 'DRAFT' | 'PUBLISHED';
export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

// ---------------------------------------------------------------------------
// Core entity types
// ---------------------------------------------------------------------------

export interface Category {
  id: number;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description?: string;
  date: string;
  time: string;
  /** Canonical camelCase field */
  venueAddress: string;
  coordinatesLat?: number | null;
  coordinatesLng?: number | null;
  ticketPrice: number;
  featured: boolean;
  imageUrl?: string | null;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;

  // Relations
  categoryId?: number | null;
  category?: Category | null;
  organizerId?: number | null;
  organizer?: {
    id: number;
    username: string;
    email: string;
  } | null;

  // Computed fields returned by the API
  rsvpCount?: number;
  userHasRSVPed?: boolean;

  // ---------------------------------------------------------------------------
  // Backward-compatibility aliases (kept so existing components don't break)
  // ---------------------------------------------------------------------------
  /** @deprecated Use `venueAddress` */
  venue_address?: string;
  /** @deprecated Use `coordinatesLat` / `coordinatesLng` */
  coordinates?: {
    lat: number;
    lng: number;
  };
  /** @deprecated Use `imageUrl` */
  image?: {
    url: string;
  };
  /** @deprecated Use `ticketPrice` */
  ticket_price?: number;
  /** @deprecated Strapi artefact — not present in the unified API */
  documentId?: string;
}

export interface RSVP {
  id: number;
  createdAt: string;
  userId: number;
  eventId: number;
  event?: Event & { category?: Category | null };
}

export interface Favorite {
  id: number;
  createdAt: string;
  userId: number;
  eventId: number;
  event?: Event & { category?: Category | null };
}

export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  userId: number;
  eventId: number;
  user?: {
    id: number;
    username: string;
  };
}

// ---------------------------------------------------------------------------
// API response wrapper types
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      pageCount: number;
    };
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    status: number;
    message: string;
    details?: unknown;
  };
}

// ---------------------------------------------------------------------------
// NextAuth module augmentation — extends session.user with app-specific fields
// ---------------------------------------------------------------------------

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      username: string;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    username: string;
    role: UserRole;
  }
}
