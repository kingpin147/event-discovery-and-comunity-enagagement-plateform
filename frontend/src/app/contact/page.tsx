'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container px-4 py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Get in Touch</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions about an event or need help with your account? 
              Our team is here to support you 24/7.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email Us', detail: 'support@eventify.com' },
              { icon: Phone, title: 'Call Us', detail: '+1 (555) 123-4567' },
              { icon: MapPin, title: 'Visit Us', detail: '123 Community Way, Tech City' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-[3rem] shadow-2xl border-none p-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
            <CardDescription>We'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Message Sent!</h2>
                  <p className="text-muted-foreground">Thank you for reaching out. We'll be in touch soon.</p>
                </div>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl px-8">Send another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">First Name</label>
                    <Input placeholder="John" className="rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Last Name</label>
                    <Input placeholder="Doe" className="rounded-xl h-12" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="rounded-xl h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <Textarea placeholder="How can we help you?" className="rounded-2xl min-h-[150px] resize-none" required />
                </div>
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 gap-2">
                  <Send className="h-5 w-5" /> Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
