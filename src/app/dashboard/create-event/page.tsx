'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Image as ImageIcon, Type, DollarSign, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getCategories } from '@/lib/api'
import { Category } from '@/types'

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venueAddress: '',
    ticketPrice: '0',
    imageUrl: '',
    categoryId: '',
  })
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Upload failed')
      if (json.data?.url) {
        setForm((prev) => ({ ...prev, imageUrl: json.data.url }))
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Image upload failed'
      setError(message)
    } finally {
      setUploadingFile(false)
    }
  }

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories:', err))
  }, [])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ticketPrice: Number(form.ticketPrice || 0),
          categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Unable to submit event')

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to submit event'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Event submitted for review</h1>
          <p className="text-muted-foreground max-w-md">
            Your event has been sent to our moderators for review. It will appear on the platform once approved.
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
                <Input placeholder="e.g. Annual Community Tech Meetup" className="rounded-xl h-12" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  Description
                </label>
                <Textarea placeholder="Describe what people can expect..." className="rounded-2xl min-h-37.5 resize-none" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
                <Input type="date" className="rounded-xl h-12" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Time
                </label>
                <Input type="time" className="rounded-xl h-12" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Venue Address
                </label>
                <Input placeholder="Full address or location name" className="rounded-xl h-12" required value={form.venueAddress} onChange={(e) => setForm({ ...form, venueAddress: e.target.value })} />
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                title="Upload event cover image"
                aria-label="Upload event cover image"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group relative overflow-hidden"
              >
                {form.imageUrl ? (
                  <>
                    <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs font-semibold">Change Image</p>
                    </div>
                  </>
                ) : uploadingFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs font-medium text-muted-foreground">Uploading to Cloudinary...</p>
                  </div>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Click to upload cover image</p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Or paste an image URL</p>
                <Input placeholder="https://example.com/cover.jpg" className="rounded-xl h-10" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
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
                <Input type="number" placeholder="0.00 (Leave 0 for free)" className="rounded-xl h-12" value={form.ticketPrice} onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  Category
                </label>
                <select
                  className="w-full rounded-xl h-12 border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.categoryId}
                  title="Select event category"
                  aria-label="Select event category"
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {error ? <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</div> : null}
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
