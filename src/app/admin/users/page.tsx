'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
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
      fetch('/api/admin/users')
        .then((res) => res.json())
        .then((json) => setUsers(json.data || []))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    }
  }, [router, session, status]);

  const updateRole = async (id: number, role: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });

    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)));
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
        <h1 className="text-3xl font-bold">User management</h1>
        <p className="text-muted-foreground">Adjust user roles and review access levels from one place.</p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.username}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>{user.email}</p>
                <p>Current role: {user.role}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => updateRole(user.id, 'USER')}>Set User</Button>
                <Button variant="secondary" onClick={() => updateRole(user.id, 'ADMIN')}>Set Admin</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
