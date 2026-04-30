'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Event } from '@/types'

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapClientProps {
  events: Event[]
  center?: [number, number]
  zoom?: number
  hoveredEventId?: string | null
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center)
  }, [center, map])
  return null
}

const MapClient = ({ events, center = [51.505, -0.09], zoom = 13, hoveredEventId }: MapClientProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      {events.map((event) => {
        if (!event.coordinates) return null
        
        const isHovered = hoveredEventId === event.documentId
        
        return (
          <Marker 
            key={event.documentId} 
            position={[event.coordinates.lat, event.coordinates.lng]}
            opacity={isHovered ? 1 : 0.7}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm">{event.title}</h3>
                <p className="text-xs text-muted-foreground">{event.venue_address}</p>
                <p className="text-xs mt-1 font-semibold text-primary">{event.time} | {event.date}</p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default MapClient
