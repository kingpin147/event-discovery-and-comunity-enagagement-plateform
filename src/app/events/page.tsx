'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Event, Category } from '@/types'
import EventCard from '@/components/events/event-card'
import EventMap from '@/components/events/event-map'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getEvents, getCategories } from '@/lib/api'

export default function EventsPage() {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [page, setPage] = useState(1)

  // Data state
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch categories once on mount
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories:', err))
  }, [])

  // Fetch events whenever search, category, or page changes
  const fetchEvents = useCallback(async (pageNum: number, append = false) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const res = await getEvents({
        search: searchQuery || undefined,
        category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        page: pageNum,
        limit: 12,
      })

      if (append) {
        setEvents((prev) => [...prev, ...res.data])
      } else {
        setEvents(res.data)
      }
      setTotalPages(res.meta.pagination.pageCount)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchQuery, selectedCategories])

  // Debounce search and reset page on filter change
  useEffect(() => {
    setPage(1)
    const timeout = setTimeout(() => {
      fetchEvents(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, selectedCategories, fetchEvents])

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchEvents(nextPage, true)
  }

  // Client-side multi-category filter (API supports single category; this handles multi-select locally)
  const filteredEvents = useMemo(() => {
    if (selectedCategories.length <= 1) return events
    return events.filter(event =>
      event.category && selectedCategories.includes(event.category.slug)
    )
  }, [events, selectedCategories])

  // Map center logic
  const mapCenter: [number, number] = useMemo(() => {
    if (hoveredEventId) {
      const event = filteredEvents.find(e => String(e.id) === hoveredEventId)
      if (event?.coordinatesLat && event?.coordinatesLng) {
        return [event.coordinatesLat, event.coordinatesLng]
      }
    }
    return [40.7589, -73.9851]
  }, [hoveredEventId, filteredEvents])

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
          {categories.map((category) => (
            <Badge
              key={category.id}
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isHovered={hoveredEventId === String(event.id)}
                    onHover={setHoveredEventId}
                  />
                ))}
              </div>
              {page < totalPages && (
                <div className="flex justify-center py-4">
                  <Button
                    variant="outline"
                    className="font-bold"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                      </>
                    ) : (
                      'Load More Events'
                    )}
                  </Button>
                </div>
              )}
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
