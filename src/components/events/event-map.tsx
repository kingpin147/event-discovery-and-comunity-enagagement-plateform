'use client'

import dynamic from 'next/dynamic'
import { Event } from '@/types'

const MapClient = dynamic(() => import('./map-client'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center rounded-lg border">
      <p className="text-muted-foreground font-medium">Loading Map...</p>
    </div>
  ),
})

interface EventMapProps {
  events: Event[]
  center?: [number, number]
  zoom?: number
  hoveredEventId?: string | null
}

const EventMap = (props: EventMapProps) => {
  return <MapClient {...props} />
}

export default EventMap
