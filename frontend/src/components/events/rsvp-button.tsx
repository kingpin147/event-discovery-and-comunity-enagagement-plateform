'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'

interface RSVPButtonProps {
  eventId: string
  isRSVPed?: boolean
}

export default function RSVPButton({ eventId, isRSVPed: initialRSVPed = false }: RSVPButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isRSVPed, setIsRSVPed] = useState(initialRSVPed)

  const handleRSVP = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)

    try {
      // In real app, this would be a POST to Strapi
      // const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/rsvps`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${(session as any).jwt}`,
      //   },
      //   body: JSON.stringify({ data: { event: eventId, user: (session as any).id } }),
      // })

      // Mocking success
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsRSVPed(true)
    } catch (error) {
      console.error('RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      className={`w-full h-14 text-lg font-bold shadow-lg transition-all ${isRSVPed ? 'bg-green-600 hover:bg-green-700' : 'shadow-primary/25'}`}
      size="lg"
      onClick={handleRSVP}
      disabled={loading || isRSVPed}
    >
      {loading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : isRSVPed ? (
        <>
          <Check className="mr-2 h-5 w-5" /> RSVP Confirmed
        </>
      ) : (
        'RSVP for this Event'
      )}
    </Button>
  )
}
