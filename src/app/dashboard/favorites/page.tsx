'use client'

import React, { useEffect, useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getMyFavorites } from '@/lib/api'
import { Favorite } from '@/types'
import EventCard from '@/components/events/event-card'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyFavorites()
      .then((res) => setFavorites(res.data))
      .catch((err) => console.error('Failed to load favorites:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleFavoriteToggle = (eventId: number, favoriteId: number | null) => {
    if (favoriteId === null) {
      // Remove from list immediately upon unfavoriting
      setFavorites((prev) => prev.filter((f) => f.eventId !== eventId))
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorite Events</h1>
          <p className="text-muted-foreground">Keep track of the experiences that caught your eye.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            if (!fav.event) return null
            return (
              <EventCard
                key={fav.id}
                event={fav.event}
                initialFavoriteId={fav.id}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )
          })}
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 bg-card rounded-[3rem] border shadow-sm flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center">
            <Heart className="h-12 w-12 text-primary/20" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">No favorites yet</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Click the heart icon on any event to save it here for later.
            </p>
          </div>
          <Link href="/events">
            <Button className="rounded-xl px-8 h-12 font-bold">Explore Events</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
