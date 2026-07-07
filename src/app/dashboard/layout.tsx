'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation'
import { Calendar, User, Settings, LogOut, Heart, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  if (status === 'loading') {
    return <div className="container py-20 text-center">Loading dashboard...</div>
  }

  const navItems = [
    { name: 'My RSVPs', href: '/dashboard', icon: Calendar },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
    { name: 'Create Event', href: '/dashboard/create-event', icon: PlusCircle },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-4">
          <div className="p-6 rounded-2xl border bg-card flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/5">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{session?.user?.name || 'User'}</h2>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{session?.user?.email}</p>
            </div>
            <Link href="/dashboard/profile" className="w-full">
              <Button variant="outline" size="sm" className="w-full rounded-xl">Edit Profile</Button>
            </Link>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start gap-3 font-semibold rounded-xl transition-all",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
            <Button 
              variant="ghost" 
              onClick={() => signOut()}
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl font-semibold mt-4"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[60vh]">
          {children}
        </main>
      </div>
    </div>
  )
}
