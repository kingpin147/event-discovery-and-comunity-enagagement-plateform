'use client'

import React from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FavoritesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorite Events</h1>
          <p className="text-muted-foreground">Keep track of the experiences that caught your eye.</p>
        </div>
      </div>

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
    </div>
  )
}
