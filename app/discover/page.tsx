"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: string
  title: string
  date: string
  time?: string
  location: string
  description?: string
  type?: string
  maxParticipants?: number
  checkInPoints: number
  tags: string[]
  requiredPoints?: number
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-600">
            {event.date} {event.time && `| ${event.time}`} | {event.location}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {event.tags.map((tag, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="secondary" className="flex items-center mb-2">
            <Star className="w-3 h-3 mr-1" />
            {event.checkInPoints}
          </Badge>
          <Link href={`/events/${event.id}`} passHref>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
)

const Discover: React.FC = () => {
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([])
  const [userInterests, setUserInterests] = useState<Record<string, number>>({})

  useEffect(() => {
    // Load user's checked-in events and extract interests
    const loadUserInterests = () => {
      try {
        // Get checked-in events
        const checkedInEventIds = JSON.parse(localStorage.getItem("checkedInEvents") || "[]")

        // Get all events
        const allEvents = JSON.parse(localStorage.getItem("allEvents") || "{}")

        // Extract tags from checked-in events and count occurrences
        const interests: Record<string, number> = {}

        checkedInEventIds.forEach((eventId: string) => {
          const event = allEvents[eventId]
          if (event && event.tags) {
            event.tags.forEach((tag: string) => {
              interests[tag] = (interests[tag] || 0) + 1
            })
          }

          // Also count event types as interests
          if (event && event.type) {
            interests[event.type] = (interests[event.type] || 0) + 1
          }
        })

        setUserInterests(interests)

        // Generate recommendations based on interests
        generateRecommendations(interests, allEvents, checkedInEventIds)
      } catch (e) {
        console.error("Error loading user interests", e)
      }
    }

    loadUserInterests()

    // Listen for events updates
    const handleEventsUpdate = () => {
      loadUserInterests()
    }

    window.addEventListener("eventsUpdated", handleEventsUpdate)
    window.addEventListener("pointsUpdated", handleEventsUpdate)

    return () => {
      window.removeEventListener("eventsUpdated", handleEventsUpdate)
      window.removeEventListener("pointsUpdated", handleEventsUpdate)
    }
  }, [])

  // Generate recommendations based on user interests
  const generateRecommendations = (
    interests: Record<string, number>,
    allEvents: Record<string, Event>,
    checkedInEventIds: string[],
  ) => {
    // If no interests yet, show some default events
    if (Object.keys(interests).length === 0) {
      // Use mock data for demonstration
      const defaultEvents: Event[] = [
        {
          id: "default1",
          title: "AI in Healthcare Symposium",
          date: "2023-07-15",
          location: "Medical School Auditorium",
          checkInPoints: 15,
          tags: ["Technology", "Healthcare", "AI"],
        },
        {
          id: "default2",
          title: "Sustainable Fashion Workshop",
          date: "2023-07-18",
          location: "Design Building, Room 101",
          checkInPoints: 10,
          tags: ["Fashion", "Sustainability", "Workshop"],
        },
        {
          id: "default3",
          title: "International Food Festival",
          date: "2023-07-20",
          location: "University Square",
          checkInPoints: 20,
          tags: ["Food", "Culture", "International"],
        },
      ]

      setRecommendedEvents(defaultEvents)
      return
    }

    // Score each event based on how well it matches user interests
    const eventScores: Record<string, number> = {}

    Object.entries(allEvents).forEach(([eventId, event]) => {
      // Skip events the user has already checked in to
      if (checkedInEventIds.includes(eventId)) {
        return
      }

      let score = 0

      // Score based on tags
      event.tags?.forEach((tag) => {
        if (interests[tag]) {
          score += interests[tag] * 2 // Weight tag matches more heavily
        }
      })

      // Score based on event type
      if (event.type && interests[event.type]) {
        score += interests[event.type] * 3 // Weight type matches even more
      }

      if (score > 0) {
        eventScores[eventId] = score
      }
    })

    // Sort events by score and take top 5
    const topEventIds = Object.entries(eventScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([eventId]) => eventId)

    // Get the actual event objects
    const recommendations = topEventIds.map((id) => allEvents[id])

    // If we don't have enough recommendations, add some default ones
    if (recommendations.length < 3) {
      // Add mock events to fill in
      const mockEvents: Event[] = [
        {
          id: "mock1",
          title: "Robotics Competition",
          date: "2023-07-22",
          location: "Engineering Building",
          checkInPoints: 25,
          tags: ["Technology", "Competition", "Robotics"],
        },
        {
          id: "mock2",
          title: "Photography Workshop",
          date: "2023-07-25",
          location: "Arts Center",
          checkInPoints: 15,
          tags: ["Arts", "Workshop", "Photography"],
        },
      ]

      recommendations.push(...mockEvents.slice(0, 5 - recommendations.length))
    }

    setRecommendedEvents(recommendations)
  }

  // Extract top interests for display
  const topInterests = Object.entries(userInterests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([interest]) => interest)

  return (
    <Layout title="Discover">
      <div className="space-y-4 pb-16">
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topInterests.length > 0 ? (
              <>
                <p className="text-sm mb-2">Based on your interests:</p>
                <div className="flex flex-wrap gap-2">
                  {topInterests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="bg-white/20">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm">Check in to events to get personalized recommendations!</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {recommendedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {recommendedEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No recommendations available yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check in to events to get personalized recommendations!</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Discover
