'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, MapPin, Clock, Share2, Heart, Users, ExternalLink, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import EventMap from '@/components/events/event-map'
import RSVPButton from '@/components/events/rsvp-button'
import { Event, Review } from '@/types'
import { getEvent } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: session } = useSession()

  const [event, setEvent] = useState<Event | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [favoriteId, setFavoriteId] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return

    let isActive = true

    void (async () => {
      setLoading(true)
      try {
        const eventRes = await getEvent(slug)
        if (!isActive) return

        setEvent(eventRes.data)
        
        // Fetch reviews
        const reviewRes = await fetch(`/api/reviews?eventId=${eventRes.data.id}`)
        const reviewJson = await reviewRes.json()
        if (!isActive) return
        setReviews(reviewJson.data || [])

        // Fetch favorite status if logged in
        if (session?.user) {
          const favRes = await fetch('/api/favorites/my')
          const favJson = await favRes.json()
          if (isActive && favJson.data) {
            const fav = favJson.data.find((f: any) => f.eventId === eventRes.data.id)
            setFavoriteId(fav ? fav.id : null)
          }
        }
      } catch (err) {
        if (!isActive) return
        setError(err instanceof Error ? err.message : 'Failed to load event')
      } finally {
        if (isActive) setLoading(false)
      }
    })()

    return () => {
      isActive = false
    }
  }, [slug, session])

  const handleFavoriteClick = async () => {
    if (!session?.user || !event) {
      window.location.href = '/auth/signin'
      return
    }

    try {
      if (favoriteId !== null) {
        await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' })
        setFavoriteId(null)
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: event.id }),
        })
        const json = await res.json()
        if (res.ok && json.data) {
          setFavoriteId(json.data.id)
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event || !session?.user) return

    const sessionUser = session.user as { id?: string; username?: string | null; name?: string | null }

    setReviewLoading(true)
    setReviewError(null)
    setReviewSuccess(false)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, rating: Number(reviewForm.rating), comment: reviewForm.comment }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Unable to save review')

      setReviews((prev) => [{
        id: json.data.id,
        rating: json.data.rating,
        comment: json.data.comment,
        createdAt: json.data.createdAt,
        userId: json.data.userId,
        eventId: json.data.eventId,
        user: { id: Number(sessionUser.id ?? 0), username: sessionUser.username || sessionUser.name || 'You' },
      }, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      setReviewSuccess(true)
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Unable to save review')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading event details...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Event not found</h2>
        <p className="text-muted-foreground mb-4">{error || 'This event does not exist.'}</p>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    )
  }

  const venueAddress = event.venueAddress || event.venue_address || ''
  const ticketPrice = event.ticketPrice ?? event.ticket_price ?? 0
  const lat = event.coordinatesLat ?? event.coordinates?.lat ?? 0
  const lng = event.coordinatesLng ?? event.coordinates?.lng ?? 0

  return (
    <div className="flex flex-col gap-0 pb-20">
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Calendar className="h-20 w-20 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="container relative h-full flex flex-col justify-end pb-8">
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-white/80 hover:text-white transition-colors">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/events" className="text-white/80 hover:text-white transition-colors">Events</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-bold">{event.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">{event.category?.name}</Badge>
              {event.featured && <Badge variant="secondary">Featured Event</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date</span>
                <div className="flex items-center gap-2 font-bold"><Calendar className="h-4 w-4 text-primary" />{event.date}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Time</span>
                <div className="flex items-center gap-2 font-bold"><Clock className="h-4 w-4 text-primary" />{event.time}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</span>
                <div className="flex items-center gap-2 font-bold text-primary">{ticketPrice === 0 ? 'FREE' : `$${ticketPrice}`}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About this event</h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Location</h2>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  <ExternalLink className="h-4 w-4" /> Get Directions
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4"><MapPin className="h-5 w-5 text-primary" />{venueAddress}</div>
              <div className="h-[300px] w-full rounded-2xl overflow-hidden border shadow-inner">
                <EventMap events={[event]} center={[lat, lng]} zoom={15} />
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <span className="text-sm text-muted-foreground">{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
              </div>

              {session?.user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-3 rounded-xl border bg-muted/30 p-4">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <button key={idx} type="button" aria-label={`Rate ${idx + 1} star${idx + 1 === 1 ? '' : 's'}`} onClick={() => setReviewForm((prev) => ({ ...prev, rating: idx + 1 }))} className="text-amber-500">
                        <Star className={`h-5 w-5 ${idx < reviewForm.rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))} placeholder="Share what you thought about this event" className="min-h-24 w-full rounded-xl border bg-background p-3 text-sm" />
                  {reviewError ? <p className="text-sm text-destructive">{reviewError}</p> : null}
                  {reviewSuccess ? <p className="text-sm text-green-600">Thanks for your review.</p> : null}
                  <Button type="submit" disabled={reviewLoading}>{reviewLoading ? 'Saving...' : 'Submit Review'}</Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">Sign in to leave a review for this event.</p>
              )}

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
                ) : reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold">{review.user?.username || 'Anonymous'}</div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`h-4 w-4 ${idx < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment ? <p className="text-sm text-muted-foreground">{review.comment}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="p-8 rounded-3xl border bg-card shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="h-20 w-20" /></div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Join the Event</h3>
                  <p className="text-muted-foreground text-sm">Register now to secure your spot and get updates.</p>
                </div>

                {event.rsvpCount != null && (
                  <div className="flex items-center gap-2 text-sm font-medium p-3 rounded-xl bg-primary/5 text-primary border border-primary/10">
                    <Users className="h-4 w-4" />{event.rsvpCount} {event.rsvpCount === 1 ? 'Person is' : 'People are'} going
                  </div>
                )}

                <div className="space-y-3">
                  <RSVPButton eventId={event.id} isRSVPed={event.userHasRSVPed} />
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={favoriteId !== null ? "default" : "outline"}
                      onClick={handleFavoriteClick}
                      className="h-12"
                    >
                      <Heart className={cn("mr-2 h-4 w-4", favoriteId !== null && "fill-current text-white")} />
                      {favoriteId !== null ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="h-12"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                  </div>
                </div>

                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">Secure Checkout powered by Eventify</p>
              </div>

              <div className="p-6 rounded-2xl border bg-muted/50 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{event.organizer?.username?.substring(0, 2).toUpperCase() || 'EM'}</div>
                <div>
                  <h4 className="font-bold">{event.organizer?.username || 'Event Masters'}</h4>
                  <p className="text-xs text-muted-foreground">Event Organizer</p>
                </div>
                <Button variant="link" className="ml-auto text-xs">Follow</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
