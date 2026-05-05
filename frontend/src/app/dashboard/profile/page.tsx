'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { User, Mail, Shield, Save, Camera } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2rem] shadow-xl border-none">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your basic identity information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Display Name
                  </label>
                  <Input defaultValue={session?.user?.name || ''} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Email Address
                  </label>
                  <Input defaultValue={session?.user?.email || ''} disabled className="rounded-xl h-12 bg-muted/50" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="rounded-xl h-12 px-8 font-bold gap-2" disabled={loading}>
                  {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Changes</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl border-none text-center p-6">
            <div className="relative mx-auto w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                <User className="h-16 w-16 text-primary" />
              </div>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-10 w-10 border-4 border-background shadow-md">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="font-bold text-xl">{session?.user?.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground mb-6">Member since 2026</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Joined</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">5</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Created</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] shadow-xl border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full rounded-xl h-12 font-semibold">Change Password</Button>
            </CardContent>
            <CardFooter>
              <p className="text-[10px] text-muted-foreground text-center w-full">
                Last password change: 3 months ago
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
