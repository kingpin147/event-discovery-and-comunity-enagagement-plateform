'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event } from '@/types'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: Event
  isHovered?: boolean
  onHover?: (id: string | null) => void
}

const EventCard = ({ event, isHovered, onHover }: EventCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col h-full",
        isHovered && "ring-2 ring-primary border-primary shadow-xl"
      )}
      onMouseEnter={() => onHover?.(event.documentId)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="relative aspect-video overflow-hidden">
        {event.image ? (
          <Image
            src={event.image.url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
        {event.featured && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground font-bold shadow-lg">
            Featured
          </Badge>
        )}
        {event.category && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 backdrop-blur-md bg-background/50"
            style={{ borderLeft: `4px solid ${event.category.color || '#000'}` }}
          >
            {event.category.name}
          </Badge>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <span className="font-bold text-primary whitespace-nowrap">
            {event.ticket_price === 0 ? 'FREE' : `$${event.ticket_price}`}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span className="line-clamp-1">{event.venue_address}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Link href={`/events/${event.slug}`} className="w-full">
          <Button className="w-full font-bold tracking-wide transition-all group-hover:shadow-md" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default EventCard
