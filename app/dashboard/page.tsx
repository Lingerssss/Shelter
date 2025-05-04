"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, MapPin } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  location: string
  checkInPoints: number
  requiredPoints?: number
  tags?: string[]
}

const EventCard: React.FC<{ event: Event; userPoints: number }> = ({ event, userPoints }) => {
  const isEligible = !event.requiredPoints || userPoints >= event.requiredPoints

  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="text-sm font-semibold truncate">{event.title}</h3>
            <div className="flex flex-col text-xs text-gray-600 mt-1">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{event.date}</span>
              </div>
              <div className="flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
            {event.requiredPoints && (
              <p className="text-xs text-amber-600 mt-1">Requires {event.requiredPoints} points</p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="secondary" className="flex items-center mb-2">
              <Star className="w-3 h-3 mr-1" />
              {event.checkInPoints}
            </Badge>
            <Link href={`/events/${event.id}`} passHref>
              <Button variant="outline" size="sm" disabled={!isEligible}>
                {isEligible ? "View" : "Locked"}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [userPoints, setUserPoints] = useState(0)

  // Load events and user points
  useEffect(() => {
    const loadEvents = () => {
      try {
        // Get all events from localStorage
        const storedEvents = JSON.parse(localStorage.getItem("allEvents") || "{}")

        // Convert to array and add some default events if empty
        let eventsArray = Object.values(storedEvents) as Event[]

        if (eventsArray.length === 0) {
          // Default events
          eventsArray = [
            {
              id: "1",
              title: "Campus Music Festival",
              date: "2023-07-15",
              location: "University Amphitheater",
              checkInPoints: 10,
              tags: ["Music", "Entertainment", "Campus"],
            },
            {
              id: "2",
              title: "Coding Workshop",
              date: "2023-07-18",
              location: "Computer Science Building",
              checkInPoints: 15,
              tags: ["Technology", "Education", "Coding"],
            },
            {
              id: "3",
              title: "Charity Run",
              date: "2023-07-20",
              location: "City Park",
              checkInPoints: 20,
              tags: ["Sports", "Charity", "Outdoors"],
            },
            {
              id: "4",
              title: "Art Exhibition",
              date: "2023-07-22",
              location: "Student Center",
              checkInPoints: 10,
              requiredPoints: 30,
              tags: ["Art", "Culture", "Exhibition"],
            },
            {
              id: "5",
              title: "Leadership Seminar",
              date: "2023-07-25",
              location: "Business School",
              checkInPoints: 25,
              requiredPoints: 50,
              tags: ["Career", "Education", "Leadership"],
            },
          ]

          // Store these default events
          const eventsObj: Record<string, Event> = {}
          eventsArray.forEach((event) => {
            eventsObj[event.id] = event
          })
          localStorage.setItem("allEvents", JSON.stringify(eventsObj))
        }

        setEvents(eventsArray)

        // Get user points
        const points = Number.parseInt(localStorage.getItem("userPoints") || "0")
        setUserPoints(points)
      } catch (e) {
        console.error("Error loading events", e)
      }
    }

    loadEvents()

    const handleEventsUpdate = () => {
      loadEvents()
    }

    window.addEventListener("storage", handleEventsUpdate)
    window.addEventListener("eventsUpdated", handleEventsUpdate)
    window.addEventListener("pointsUpdated", handleEventsUpdate)

    return () => {
      window.removeEventListener("storage", handleEventsUpdate)
      window.removeEventListener("eventsUpdated", handleEventsUpdate)
      window.removeEventListener("pointsUpdated", handleEventsUpdate)
    }
  }, [])

  return (
    <Layout title="Dashboard">
      <div className="space-y-4 pb-16">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Discover Events</h1>
          <Badge variant="outline" className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {userPoints} points
          </Badge>
        </div>

        <div className="space-y-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} userPoints={userPoints} />
          ))}
        </div>

        <Link href="/create-event" passHref>
          <Button className="w-full" size="sm">
            Create New Event
          </Button>
        </Link>
      </div>
    </Layout>
  )
}

export default Dashboard
