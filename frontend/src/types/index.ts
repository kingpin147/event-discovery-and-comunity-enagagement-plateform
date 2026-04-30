export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

export interface Event {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  date: string;
  time: string;
  venue_address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  ticket_price: number;
  featured: boolean;
  image?: {
    url: string;
  };
  category?: Category;
}
