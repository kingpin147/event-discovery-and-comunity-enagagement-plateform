'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
      return;
    }

    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.replace('/dashboard');
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/admin/events')
        .then((res) => res.json())
        .then((json) => setEvents(json.data || []))
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    }
  }, [router, session, status]);

  const updateEvent = async (id: number, status: string, featured: boolean) => {
    await fetch('/api/admin/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, featured }),
    });

    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, status, featured } : event)));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin dashboard</h1>
        <p className="text-muted-foreground">Review submitted events, approve them, and feature important ones.</p>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Organizer: {event.organizer?.username || 'Unknown'}</p>
                <p>Status: {event.status}</p>
                <p>Featured: {event.featured ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => updateEvent(event.id, 'PUBLISHED', event.featured)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button variant="outline" onClick={() => updateEvent(event.id, 'DRAFT', event.featured)}>
                  <XCircle className="mr-2 h-4 w-4" /> Hold
                </Button>
                <Button variant="secondary" onClick={() => updateEvent(event.id, event.status, !event.featured)}>
                  {event.featured ? 'Unfeature' : 'Feature'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
