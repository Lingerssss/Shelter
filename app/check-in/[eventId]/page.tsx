"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CheckCircle, Award, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CheckInProps {
  params: { eventId: string }
}

// Custom hook to manage check-in state
const useCheckInState = (eventId: string) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  useEffect(() => {
    // Check if user has already checked in to this event
    try {
      const checkedInEvents = JSON.parse(localStorage.getItem("checkedInEvents") || "[]")
      setIsCheckedIn(checkedInEvents.includes(eventId))
    } catch (e) {
      console.error("Error reading from localStorage", e)
    }
  }, [eventId])

  const checkIn = () => {
    try {
      const checkedInEvents = JSON.parse(localStorage.getItem("checkedInEvents") || "[]")
      if (!checkedInEvents.includes(eventId)) {
        checkedInEvents.push(eventId)
        localStorage.setItem("checkedInEvents", JSON.stringify(checkedInEvents))

        // Update user points
        const currentPoints = Number.parseInt(localStorage.getItem("userPoints") || "0")
        const earnedPoints = 10 // This would come from the event data in a real app
        localStorage.setItem("userPoints", (currentPoints + earnedPoints).toString())

        // Dispatch event for other components to update
        window.dispatchEvent(new Event("pointsUpdated"))

        setIsCheckedIn(true)
        return earnedPoints
      }
      return 0
    } catch (e) {
      console.error("Error writing to localStorage", e)
      return 0
    }
  }

  return { isCheckedIn, checkIn }
}

const CheckIn: React.FC<CheckInProps> = ({ params }) => {
  const router = useRouter()
  const [points, setPoints] = useState(0)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { isCheckedIn, checkIn } = useCheckInState(params.eventId)

  // Mock event data - in a real app, you'd fetch this based on the eventId
  const event = {
    id: params.eventId,
    title: "Campus Music Festival",
    date: "2023-07-15",
    location: "University Amphitheater",
    checkInPoints: 10,
  }

  // Load user points
  useEffect(() => {
    try {
      const userPoints = Number.parseInt(localStorage.getItem("userPoints") || "0")
      setPoints(userPoints)
    } catch (e) {
      console.error("Error reading user points", e)
    }

    const handlePointsUpdate = () => {
      try {
        const userPoints = Number.parseInt(localStorage.getItem("userPoints") || "0")
        setPoints(userPoints)
      } catch (e) {
        console.error("Error reading user points", e)
      }
    }

    window.addEventListener("pointsUpdated", handlePointsUpdate)
    return () => window.removeEventListener("pointsUpdated", handlePointsUpdate)
  }, [])

  const handleCheckIn = () => {
    const points = checkIn()
    setEarnedPoints(points)
  }

  return (
    <Layout title="Event Check-in" showBackButton onBack={() => router.back()}>
      <div className="space-y-4 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {event.date} | {event.location}
            </p>
            {!isCheckedIn ? (
              <Button onClick={handleCheckIn} className="w-full mt-4">
                Check In
              </Button>
            ) : (
              <div className="flex items-center justify-center text-green-600 mt-4">
                <CheckCircle className="mr-2" />
                <span>Already Checked In</span>
              </div>
            )}
          </CardContent>
        </Card>

        {isCheckedIn && (
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2" />
                Rewards Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">+{earnedPoints || event.checkInPoints} points</p>
              <p className="text-sm mt-2">Keep attending events to earn more rewards!</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">Total Points: {points}</p>
            <Progress value={points % 100} className="w-full" />
            <p className="text-sm mt-2">Next level: {100 - (points % 100)} points to go</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default CheckIn
