import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EventCard from "@/components/events/event-card";

// Mock Data for Featured Events
const FEATURED_EVENTS = [
  {
    id: 1,
    documentId: 'evt_1',
    title: 'Summer Music Festival 2026',
    slug: 'summer-music-festival-2026',
    date: 'July 15, 2026',
    time: '4:00 PM',
    venue_address: 'Central Park, New York',
    ticket_price: 45,
    featured: true,
    category: { name: 'Music', color: '#3b82f6' }
  },
  {
    id: 2,
    documentId: 'evt_2',
    title: 'Tech Innovation Summit',
    slug: 'tech-innovation-summit',
    date: 'August 10, 2026',
    time: '9:00 AM',
    venue_address: 'Javits Center, New York',
    ticket_price: 0,
    featured: true,
    category: { name: 'Tech', color: '#10b981' }
  },
  {
    id: 3,
    documentId: 'evt_3',
    title: 'Food & Wine Expo',
    slug: 'food-wine-expo',
    date: 'September 5, 2026',
    time: '12:00 PM',
    venue_address: 'Hudson Yards, New York',
    ticket_price: 25,
    featured: true,
    category: { name: 'Food', color: '#f59e0b' }
  },
  {
    id: 4,
    documentId: 'evt_4',
    title: 'Art in the Park',
    slug: 'art-in-the-park',
    date: 'June 20, 2026',
    time: '10:00 AM',
    venue_address: 'Prospect Park, Brooklyn',
    ticket_price: 0,
    featured: true,
    category: { name: 'Art', color: '#8b5cf6' }
  }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient/Image Overlay */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="container relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Discover Live Events
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8">
            Moments that <span className="text-primary italic">Matter</span>, <br />
            Nearby and Now.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Eventify connects you with the most exciting events in your community. 
            From local meetups to global festivals, find your next experience here.
          </p>
          
          <div className="max-w-5xl mx-auto p-3 bg-background/80 backdrop-blur-xl border rounded-3xl shadow-2xl ring-1 ring-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 border-r last:border-r-0">
                <Search className="h-5 w-5 text-primary" />
                <Input placeholder="What's happening?" className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-base" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 border-r last:border-r-0">
                <MapPin className="h-5 w-5 text-primary" />
                <Input placeholder="Location" className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-base" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 border-r last:border-r-0">
                <Calendar className="h-5 w-5 text-primary" />
                <Input type="date" className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-base" />
              </div>
              <Button className="h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20">Find Events</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Carousel */}
      <section className="container">
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Events</h2>
              <p className="text-muted-foreground">Hand-picked experiences you shouldn't miss.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="group text-primary font-bold">
                View all <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {FEATURED_EVENTS.map((event) => (
                  <CarouselItem key={event.documentId} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <EventCard event={event as any} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12 h-12 w-12" />
              <CarouselNext className="-right-12 h-12 w-12" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 rounded-3xl border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all text-center group">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Calendar className="h-8 w-8 text-primary group-hover:text-inherit" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Diverse Events</h3>
            <p className="text-muted-foreground leading-relaxed">Thousands of events ranging from workshops to concerts every week.</p>
          </div>
          <div className="p-8 rounded-3xl border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all text-center group">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Users className="h-8 w-8 text-primary group-hover:text-inherit" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Active Community</h3>
            <p className="text-muted-foreground leading-relaxed">Engage with like-minded people and build lasting connections.</p>
          </div>
          <div className="p-8 rounded-3xl border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all text-center group">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <MapPin className="h-8 w-8 text-primary group-hover:text-inherit" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Interactive Maps</h3>
            <p className="text-muted-foreground leading-relaxed">Find events near you with our real-time interactive mapping system.</p>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Calendar className="h-40 w-40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground max-w-3xl mx-auto">
            Ready to experience something new?
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-xl mx-auto">
            Join 10,000+ people discovering events every day. Sign up for our weekly newsletter.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="h-14 rounded-2xl bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
            <Button variant="secondary" className="h-14 px-8 font-bold text-lg rounded-2xl">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
