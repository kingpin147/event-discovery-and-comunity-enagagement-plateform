'use client'

import React from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your RSVPs</h1>
          <p className="text-muted-foreground">Manage your upcoming event registrations.</p>
        </div>
        <Link href="/events">
          <Button className="rounded-xl shadow-lg shadow-primary/10">Find More Events</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock RSVPed Event - In a real app, this would be fetched from /api/rsvps */}
        <Card className="overflow-hidden border-none bg-card shadow-xl hover:shadow-2xl transition-all group rounded-2xl">
          <div className="h-2 w-full bg-primary" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">Summer Music Festival 2026</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" /> July 15, 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Central Park, NY
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" size="sm" className="rounded-lg px-4">View Ticket</Button>
              <Button variant="outline" size="sm" className="rounded-lg text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20">Cancel RSVP</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Empty State placeholder if no RSVPs */}
        {/* <div className="col-span-full py-20 text-center space-y-4 bg-muted/30 rounded-[2rem] border-2 border-dashed">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
          <p className="text-muted-foreground font-medium">You haven't registered for any events yet.</p>
          <Link href="/events">
            <Button variant="outline">Browse Events</Button>
          </Link>
        </div> */}
      </div>
    </div>
  )
}
