'use client'

import React, { useState, useMemo } from 'react'
import { Event, Category } from '@/types'
import EventCard from '@/components/events/event-card'
import EventMap from '@/components/events/event-map'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock Data for demonstration
const MOCK_CATEGORIES: Category[] = [
  { id: 1, documentId: 'cat_1', name: 'Music', slug: 'music', color: '#3b82f6' },
  { id: 2, documentId: 'cat_2', name: 'Tech', slug: 'tech', color: '#10b981' },
  { id: 3, documentId: 'cat_3', name: 'Food', slug: 'food', color: '#f59e0b' },
  { id: 4, documentId: 'cat_4', name: 'Sports', slug: 'sports', color: '#ef4444' },
]

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    documentId: 'evt_1',
    title: 'Summer Music Festival 2026',
    slug: 'summer-music-festival-2026',
    description: 'The biggest music event of the summer!',
    date: 'July 15, 2026',
    time: '4:00 PM',
    venue_address: 'Central Park, New York, NY',
    coordinates: { lat: 40.785091, lng: -73.968285 },
    ticket_price: 45,
    featured: true,
    category: MOCK_CATEGORIES[0]
  },
  {
    id: 2,
    documentId: 'evt_2',
    title: 'Tech Innovation Summit',
    slug: 'tech-innovation-summit',
    description: 'Exploring the future of AI and Robotics.',
    date: 'August 10, 2026',
    time: '9:00 AM',
    venue_address: 'Javits Center, New York, NY',
    coordinates: { lat: 40.7589, lng: -74.0027 },
    ticket_price: 0,
    featured: false,
    category: MOCK_CATEGORIES[1]
  },
  {
    id: 3,
    documentId: 'evt_3',
    title: 'Food & Wine Expo',
    slug: 'food-wine-expo',
    description: 'Taste the best cuisines from around the world.',
    date: 'September 5, 2026',
    time: '12:00 PM',
    venue_address: 'Hudson Yards, New York, NY',
    coordinates: { lat: 40.7538, lng: -74.0018 },
    ticket_price: 25,
    featured: false,
    category: MOCK_CATEGORIES[2]
  }
]

export default function EventsPage() {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [page, setPage] = useState(1)

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue_address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategories.length > 0 
        ? (event.category && selectedCategories.includes(event.category.slug)) 
        : true
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategories])

  // Map center logic
  const mapCenter: [number, number] = useMemo(() => {
    if (hoveredEventId) {
      const event = MOCK_EVENTS.find(e => e.documentId === hoveredEventId)
      if (event?.coordinates) return [event.coordinates.lat, event.coordinates.lng]
    }
    return [40.7589, -73.9851]
  }, [hoveredEventId])

  return (
    <div className="container py-8 flex flex-col gap-6 h-[calc(100vh-64px)] relative">
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discovery Events</h1>
            <p className="text-muted-foreground text-sm">Find and RSVP to amazing events near you.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search events..." 
                className="pl-8 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategories.length === 0 ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5 text-xs font-bold transition-all"
            onClick={() => setSelectedCategories([])}
          >
            All Events
          </Badge>
          {MOCK_CATEGORIES.map((category) => (
            <Badge
              key={category.documentId}
              variant={selectedCategories.includes(category.slug) ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 text-xs font-bold transition-all"
              onClick={() => toggleCategory(category.slug)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden relative">
        {/* List View */}
        <div className={`w-full lg:w-3/5 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6 pb-20 lg:pb-8 ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
          {filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard 
                    key={event.documentId} 
                    event={event} 
                    isHovered={hoveredEventId === event.documentId}
                    onHover={setHoveredEventId}
                  />
                ))}
              </div>
              <div className="flex justify-center py-4">
                <Button variant="outline" className="font-bold">Load More Events</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
              <Button variant="link" onClick={() => {setSearchQuery(''); setSelectedCategories([])}} className="mt-2 text-primary font-bold">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className={`w-full lg:w-2/5 h-full rounded-2xl overflow-hidden border shadow-inner bg-muted ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
          <EventMap 
            events={filteredEvents} 
            center={mapCenter}
            zoom={hoveredEventId ? 15 : 12}
            hoveredEventId={hoveredEventId}
          />
        </div>
      </div>

      {/* Mobile View Toggle Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <Button 
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="rounded-full h-12 px-6 shadow-2xl flex items-center gap-2 font-bold transition-all active:scale-95"
        >
          {viewMode === 'list' ? (
            <>
              <MapIcon className="h-5 w-5" /> Show Map
            </>
          ) : (
            <>
              <ListIcon className="h-5 w-5" /> Show List
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
