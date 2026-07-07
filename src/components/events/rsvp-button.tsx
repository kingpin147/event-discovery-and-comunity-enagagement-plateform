'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { createRSVP } from '@/lib/api'

interface RSVPButtonProps {
  eventId: number
  isRSVPed?: boolean
}

export default function RSVPButton({ eventId, isRSVPed: initialRSVPed = false }: RSVPButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isRSVPed, setIsRSVPed] = useState(initialRSVPed)
  const [error, setError] = useState<string | null>(null)

  const handleRSVP = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createRSVP(eventId)
      setIsRSVPed(true)
    } catch (err: any) {
      // If already RSVPed (409 conflict), treat as success
      if (err.message?.includes('Already RSVPed')) {
        setIsRSVPed(true)
      } else {
        setError(err.message || 'Failed to RSVP')
        console.error('RSVP error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
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
      {error && (
        <p className="text-xs text-destructive text-center">{error}</p>
      )}
    </div>
  )
}
