'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Calendar, MapPin, User, Settings, LogOut, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  if (status === 'loading') {
    return <div className="container py-20 text-center">Loading dashboard...</div>
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-4">
          <div className="p-6 rounded-2xl border bg-card flex flex-col items-center text-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{session?.user?.name}</h2>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
          </div>

          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2 font-semibold bg-primary/5 text-primary">
              <Calendar className="h-4 w-4" /> My RSVPs
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <Ticket className="h-4 w-4" /> My Tickets
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <Settings className="h-4 w-4" /> Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your RSVPs</h1>
              <p className="text-muted-foreground">Manage your upcoming event registrations.</p>
            </div>
            <Link href="/events">
              <Button>Find More Events</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mock RSVPed Event */}
            <Card className="overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Summer Music Festival 2026</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> July 15, 2026
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> Central Park, NY
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">View Ticket</Button>
                  <Button variant="outline" size="sm">Cancel RSVP</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
