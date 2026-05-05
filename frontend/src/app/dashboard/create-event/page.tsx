'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Image as ImageIcon, Type, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Event Submitted!</h1>
          <p className="text-muted-foreground max-w-md">
            Your event has been sent to our moderators for review. 
            It will appear on the platform once approved.
          </p>
        </div>
        <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-xl px-8">
          Submit Another Event
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground">Share your upcoming experience with the community.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <Card className="rounded-[2rem] shadow-xl border-none">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about the core details of your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Type className="h-4 w-4 text-primary" /> Event Title
                </label>
                <Input placeholder="e.g. Annual Community Tech Meetup" className="rounded-xl h-12" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  Description
                </label>
                <Textarea 
                  placeholder="Describe what people can expect..." 
                  className="rounded-2xl min-h-[150px] resize-none" 
                  required 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] shadow-xl border-none">
            <CardHeader>
              <CardTitle>Location & Time</CardTitle>
              <CardDescription>Where and when is it happening?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Date
                </label>
                <Input type="date" className="rounded-xl h-12" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Time
                </label>
                <Input type="time" className="rounded-xl h-12" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Venue Address
                </label>
                <Input placeholder="Full address or location name" className="rounded-xl h-12" required />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">Event Media</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Click to upload cover image</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-lg">Pricing & Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" /> Ticket Price
                </label>
                <Input type="number" placeholder="0.00 (Leave 0 for free)" className="rounded-xl h-12" />
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Event'}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground px-4">
                By submitting, you agree to our community guidelines. Events are usually reviewed within 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
