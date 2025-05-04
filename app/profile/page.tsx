"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Calendar, CheckCircle, Settings, LogOut, Edit, User, Bell } from "lucide-react"
import Link from "next/link"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface ActivityItem {
  id: string
  type: "check-in" | "registration" | "points"
  eventId?: string
  eventTitle?: string
  date: string
  points?: number
  description: string
}

const Profile: React.FC = () => {
  const [userPoints, setUserPoints] = useState(0)
  const [userLevel, setUserLevel] = useState(1)
  const [nextLevelProgress, setNextLevelProgress] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [checkedInCount, setCheckedInCount] = useState(0)
  const [registeredCount, setRegisteredCount] = useState(0)

  useEffect(() => {
    // Load user data
    const loadUserData = () => {
      try {
        // Get user points
        const points = Number.parseInt(localStorage.getItem("userPoints") || "0")
        setUserPoints(points)

        // Calculate level (1 level per 100 points)
        const level = Math.floor(points / 100) + 1
        setUserLevel(level)

        // Calculate progress to next level
        const progress = points % 100
        setNextLevelProgress(progress)

        // Get checked-in events
        const checkedInEvents = JSON.parse(localStorage.getItem("checkedInEvents") || "[]")
        setCheckedInCount(checkedInEvents.length)

        // Get registered events
        const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents") || "[]")
        setRegisteredCount(registeredEvents.length)

        // Generate achievements
        generateAchievements(points, checkedInEvents.length, registeredEvents.length)

        // Generate activity feed
        generateActivityFeed(checkedInEvents, registeredEvents)
      } catch (e) {
        console.error("Error loading user data", e)
      }
    }

    loadUserData()

    // Listen for updates
    const handleUpdate = () => {
      loadUserData()
    }

    window.addEventListener("pointsUpdated", handleUpdate)
    window.addEventListener("eventsUpdated", handleUpdate)

    return () => {
      window.removeEventListener("pointsUpdated", handleUpdate)
      window.removeEventListener("eventsUpdated", handleUpdate)
    }
  }, [])

  const generateAchievements = (points: number, checkedInCount: number, registeredCount: number) => {
    const achievementsList: Achievement[] = [
      {
        id: "first-checkin",
        title: "First Steps",
        description: "Check in to your first event",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        unlocked: checkedInCount > 0,
      },
      {
        id: "five-checkins",
        title: "Regular Attendee",
        description: "Check in to 5 different events",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        unlocked: checkedInCount >= 5,
        progress: Math.min(checkedInCount, 5),
        maxProgress: 5,
      },
      {
        id: "points-100",
        title: "Point Collector",
        description: "Earn 100 points",
        icon: <Star className="h-6 w-6 text-yellow-500" />,
        unlocked: points >= 100,
        progress: Math.min(points, 100),
        maxProgress: 100,
      },
    ]

    setAchievements(achievementsList)
  }

  const generateActivityFeed = (checkedInEvents: string[], registeredEvents: string[]) => {
    const allEvents = JSON.parse(localStorage.getItem("allEvents") || "{}")
    const activityItems: ActivityItem[] = []

    // Add check-ins to activity feed
    checkedInEvents.forEach((eventId) => {
      const event = allEvents[eventId]
      if (event) {
        activityItems.push({
          id: `checkin-${eventId}`,
          type: "check-in",
          eventId,
          eventTitle: event.title,
          date: new Date().toISOString(), // In a real app, you'd store the actual check-in date
          points: event.checkInPoints,
          description: `Checked in to ${event.title}`,
        })
      }
    })

    // Add registrations to activity feed
    registeredEvents.forEach((eventId) => {
      const event = allEvents[eventId]
      if (event) {
        activityItems.push({
          id: `registration-${eventId}`,
          type: "registration",
          eventId,
          eventTitle: event.title,
          date: new Date().toISOString(), // In a real app, you'd store the actual registration date
          description: `Registered for ${event.title}`,
        })
      }
    })

    // Sort by date (newest first)
    activityItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Limit to 3 items to prevent overflow
    setActivity(activityItems.slice(0, 3))
  }

  return (
    <Layout title="Profile">
      <div className="space-y-3">
        {/* User Profile Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-2 border-white">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-white text-purple-500">
                  <User className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold truncate">John Doe</h2>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1 h-auto">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs opacity-90 truncate">john.doe@university.edu</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-white/20 text-white text-xs">Level {userLevel}</Badge>
                  <span className="ml-2 text-xs">{userPoints} points</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs mb-1">Next level: {100 - nextLevelProgress} points to go</p>
              <Progress value={nextLevelProgress} className="h-1.5 bg-white/30" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-xl font-bold">{checkedInCount}</p>
              <p className="text-xs text-gray-500">Events Attended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-xl font-bold">{registeredCount}</p>
              <p className="text-xs text-gray-500">Registered Events</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Achievements and Activity */}
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="achievements" className="mt-3 space-y-3 max-h-[180px] overflow-y-auto hide-scrollbar">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={!achievement.unlocked ? "opacity-60" : undefined}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{achievement.title}</h3>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                      {achievement.progress !== undefined && achievement.maxProgress && (
                        <div className="mt-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                            {achievement.unlocked && <span className="text-green-500">Completed!</span>}
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                        </div>
                      )}
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="ml-auto">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="activity" className="mt-3 space-y-3 max-h-[180px] overflow-y-auto hide-scrollbar">
            {activity.length > 0 ? (
              activity.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {item.type === "check-in" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Calendar className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.description}</p>
                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      {item.points && (
                        <Badge className="ml-auto flex items-center">
                          <Star className="h-3 w-3 mr-1" />+{item.points}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No activity yet.</p>
                <p className="text-gray-500 text-xs mt-1">Check in to events to see your activity here!</p>
              </div>
            )}
            {activity.length > 0 && (
              <Button variant="outline" size="sm" className="w-full text-xs py-1 h-auto">
                View All Activity
              </Button>
            )}
          </TabsContent>
        </Tabs>

        {/* Settings and Logout - Redesigned as a card */}
        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/settings"
                className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Settings</span>
              </Link>
              <Link
                href="/notifications"
                className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100"
              >
                <Bell className="h-5 w-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Notifications</span>
              </Link>
              <Link href="/" className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100">
                <LogOut className="h-5 w-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Log Out</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Profile
