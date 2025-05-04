"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react'
import Image from "next/image"
import useLocalStorage from "@/hooks/useLocalStorage"

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

// 使用自定义钩子管理注册状态
const useRegistrationState = (eventId: string) => {
  const [registeredEvents, setRegisteredEvents] = useLocalStorage<string[]>("registeredEvents", [])
  const isRegistered = registeredEvents.includes(eventId)

  const register = () => {
    if (!isRegistered) {
      setRegisteredEvents([...registeredEvents, eventId])
    }
  }

  const unregister = () => {
    setRegisteredEvents(registeredEvents.filter(id => id !== eventId))
  }

  return { isRegistered, register, unregister }
}

const EventDetails: React.FC<EventDetailsProps> = ({ params }) => {
  const router = useRouter()
  const { isRegistered, register, unregister } = useRegistrationState(params.eventId)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [allEvents, setAllEvents] = useLocalStorage<Record<string, Event>>("allEvents", {})

  useEffect(() => {
    // 加载事件详情
    if (Object.keys(allEvents).length > 0) {
      const eventData = allEvents[params.eventId]
      
      if (eventData) {
        setEvent(eventData)
      } else {
        // 回退到默认事件数据
        setEvent({
          id: params.eventId,
          title: "Campus Music Festival",
          description: "Join us for a night of amazing performances...",
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
  }, [params.eventId, allEvents])

  const handleRegister = () => {
    console.log(`Registering for event ${event?.id}`)
    register()
  }

  const handleCancelRegistration = () => {
    console.log(`Cancelling registration for event ${event?.id}`)
    unregister()

    // 导航回"我的事件"页面
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
