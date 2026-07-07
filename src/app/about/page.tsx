import React from 'react'
import { Users, Globe, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero */}
      <section className="relative py-24 bg-primary/5">
        <div className="container px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Our Mission</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connecting communities through shared experiences. Eventify was built to empower 
            local organizers and help people discover the moments that matter most.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Events Hosted', value: '10K+' },
            { label: 'Active Users', value: '50K+' },
            { label: 'Cities Covered', value: '200+' },
            { label: 'Organizers', value: '5K+' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-8 rounded-3xl bg-card border shadow-sm">
              <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Eventify?</h2>
          <p className="text-muted-foreground">The values that drive our platform every day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: 'Inclusivity', 
              desc: 'We believe every community deserves a voice and a space to gather.',
              icon: Users
            },
            { 
              title: 'Accessibility', 
              desc: 'Our platform is designed to be usable by everyone, everywhere.',
              icon: Globe
            },
            { 
              title: 'Safety', 
              desc: 'We prioritize the security and privacy of our users and data.',
              icon: Shield
            },
            { 
              title: 'Innovation', 
              desc: 'Pushing the boundaries of how events are discovered and managed.',
              icon: Zap
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 p-8 rounded-3xl bg-card border hover:shadow-lg transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                <item.icon className="h-7 w-7 text-primary group-hover:text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
