"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, MapPin, CheckCircle } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  location: string
  checkInPoints: number
}

// Mock events database - in a real app, this would come from your backend
const allEvents: Record<string, Event> = {
  "1": {
    id: "1",
    title: "Campus Music Festival",
    date: "2023-07-15",
    location: "University Amphitheater",
    checkInPoints: 10,
  },
  "2": {
    id: "2",
    title: "Coding Workshop",
    date: "2023-07-18",
    location: "Computer Science Building",
    checkInPoints: 15,
  },
  "3": {
    id: "3",
    title: "Charity Run",
    date: "2023-07-20",
    location: "City Park",
    checkInPoints: 20,
  },
}

const EventCard: React.FC<{ event: Event; isCheckedIn: boolean }> = ({ event, isCheckedIn }) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-base">{event.title}</CardTitle>
        <Badge variant="secondary" className="flex items-center">
          <Star className="w-4 h-4 mr-1" />
          {event.checkInPoints}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
          <span>{event.location}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <Link href={`/events/${event.id}`} passHref>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {isCheckedIn ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">Checked In</span>
          </div>
        ) : (
          <Link href={`/check-in/${event.id}`} passHref>
            <Button size="sm">Check In</Button>
          </Link>
        )}
      </div>
    </CardContent>
  </Card>
)

const Events: React.FC = () => {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [checkedInEvents, setCheckedInEvents] = useState<string[]>([])
  const [userPoints, setUserPoints] = useState(0)

  // Load registered events and checked-in events from localStorage
  useEffect(() => {
    try {
      // Load registered events
      const registeredEventIds = JSON.parse(localStorage.getItem("registeredEvents") || "[]")
      const events = registeredEventIds.map((id: string) => allEvents[id]).filter(Boolean)
      setRegisteredEvents(events)

      // Load checked-in events
      const checkedInEventIds = JSON.parse(localStorage.getItem("checkedInEvents") || "[]")
      setCheckedInEvents(checkedInEventIds)

      // Load user points
      const points = Number.parseInt(localStorage.getItem("userPoints") || "0")
      setUserPoints(points)
    } catch (e) {
      console.error("Error reading from localStorage", e)
    }

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      try {
        const registeredEventIds = JSON.parse(localStorage.getItem("registeredEvents") || "[]")
        const events = registeredEventIds.map((id: string) => allEvents[id]).filter(Boolean)
        setRegisteredEvents(events)

        const checkedInEventIds = JSON.parse(localStorage.getItem("checkedInEvents") || "[]")
        setCheckedInEvents(checkedInEventIds)

        const points = Number.parseInt(localStorage.getItem("userPoints") || "0")
        setUserPoints(points)
      } catch (e) {
        console.error("Error reading from localStorage", e)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("registrationChanged", handleStorageChange)
    window.addEventListener("pointsUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("registrationChanged", handleStorageChange)
      window.removeEventListener("pointsUpdated", handleStorageChange)
    }
  }, [])

  return (
    <Layout title="My Events">
      <div className="space-y-4 pb-16">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">My Registered Events</h1>
          <Badge variant="outline" className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {userPoints} points
          </Badge>
        </div>

        {registeredEvents.length > 0 ? (
          registeredEvents.map((event) => (
            <EventCard key={event.id} event={event} isCheckedIn={checkedInEvents.includes(event.id)} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
            <Link href="/dashboard" passHref>
              <Button>Discover Events</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Events
