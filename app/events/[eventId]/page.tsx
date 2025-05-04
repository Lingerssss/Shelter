"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react"
import Image from "next/image"

interface EventDetailsProps {
  params: { eventId: string }
}

interface Event {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  location: string
  organizer?: string
  maxParticipants?: number
  currentParticipants?: number
  checkInPoints: number
  tags?: string[]
  image?: string
  type?: string
}

// Custom hook to manage registration state
const useRegistrationState = (eventId: string) => {
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    // Check if user is registered for this event
    try {
      const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents") || "[]")
      setIsRegistered(registeredEvents.includes(eventId))
    } catch (e) {
      console.error("Error reading from localStorage", e)
    }
  }, [eventId])

  const register = () => {
    try {
      const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents") || "[]")
      if (!registeredEvents.includes(eventId)) {
        registeredEvents.push(eventId)
        localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents))
        setIsRegistered(true)
      }
    } catch (e) {
      console.error("Error writing to localStorage", e)
    }
  }

  const unregister = () => {
    try {
      let registeredEvents = JSON.parse(localStorage.getItem("registeredEvents") || "[]")
      registeredEvents = registeredEvents.filter((id: string) => id !== eventId)
      localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents))
      setIsRegistered(false)
    } catch (e) {
      console.error("Error writing to localStorage", e)
    }
  }

  return { isRegistered, register, unregister }
}

const EventDetails: React.FC<EventDetailsProps> = ({ params }) => {
  const router = useRouter()
  const { isRegistered, register, unregister } = useRegistrationState(params.eventId)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load event details
    const loadEvent = () => {
      try {
        const allEvents = JSON.parse(localStorage.getItem("allEvents") || "{}")
        const eventData = allEvents[params.eventId]

        if (eventData) {
          setEvent(eventData)
        } else {
          // Fallback to default event data
          setEvent({
            id: params.eventId,
            title: "Campus Music Festival",
            description:
              "Join us for a night of amazing performances by talented student musicians. There will be various genres including rock, jazz, classical, and more. Food and drinks will be available for purchase.",
            date: "2023-07-15",
            time: "19:00 - 23:00",
            location: "University Amphitheater",
            organizer: "Student Music Association",
            maxParticipants: 200,
            currentParticipants: 156,
            checkInPoints: 15,
            tags: ["Music", "Entertainment", "Campus"],
            image: "/vibrant-festival-crowd.png",
          })
        }
      } catch (e) {
        console.error("Error loading event", e)
        // Fallback to default event data
        setEvent({
          id: params.eventId,
          title: "Campus Music Festival",
          description:
            "Join us for a night of amazing performances by talented student musicians. There will be various genres including rock, jazz, classical, and more. Food and drinks will be available for purchase.",
          date: "2023-07-15",
          time: "19  Food and drinks will be available for purchase.",
          date: "2023-07-15",
          time: "19:00 - 23:00",
          location: "University Amphitheater",
          organizer: "Student Music Association",
          maxParticipants: 200,
          currentParticipants: 156,
          checkInPoints: 15,
          tags: ["Music", "Entertainment", "Campus"],
          image: "/vibrant-festival-crowd.png",
        })
      }
      setLoading(false)
    }

    loadEvent()
  }, [params.eventId])

  const handleRegister = () => {
    // In a real app, you would send this to your backend
    console.log(`Registering for event ${event?.id}`)
    register()
  }

  const handleCancelRegistration = () => {
    // In a real app, you would send this to your backend
    console.log(`Cancelling registration for event ${event?.id}`)
    unregister()

    // Navigate back to My Events page after a short delay
    setTimeout(() => {
      router.push("/events")
    }, 500)
  }

  if (loading || !event) {
    return (
      <Layout title="Loading..." showBackButton onBack={() => router.back()}>
        <div className="flex justify-center items-center h-64">
          <p>Loading event details...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Event Details" showBackButton onBack={() => router.back()}>
      <div className="space-y-4 pb-16">
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image src={event.image || "/placeholder.svg"} alt={event.title} fill style={{ objectFit: "cover" }} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <Badge className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {event.checkInPoints} points
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{event.description}</p>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>{event.date}</span>
              </div>
              {event.time && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{event.time}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span>{event.location}</span>
              </div>
              {event.maxParticipants && (
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    {event.currentParticipants || 0}/{event.maxParticipants} participants
                  </span>
                </div>
              )}
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!isRegistered ? (
              <Button onClick={handleRegister} className="w-full">
                Register for Event
              </Button>
            ) : (
              <Button onClick={handleCancelRegistration} variant="outline" className="w-full">
                Cancel Registration
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}

export default EventDetails
