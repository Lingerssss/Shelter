"use client"

import type React from "react"
import Layout from "@/components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Calendar, CheckCircle, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: "event" | "achievement" | "points" | "system"
}

const Notifications: React.FC = () => {
  const router = useRouter()

  // Mock notifications data - reduced to prevent scrolling
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New Event Recommendation",
      message: "We found a new event that matches your interests: 'AI Workshop'",
      date: "2023-07-10T14:30:00Z",
      read: false,
      type: "event",
    },
    {
      id: "2",
      title: "Achievement Unlocked",
      message: "Congratulations! You've unlocked the 'First Steps' achievement.",
      date: "2023-07-08T09:15:00Z",
      read: true,
      type: "achievement",
    },
    {
      id: "3",
      title: "Points Earned",
      message: "You earned 15 points for checking in to 'Campus Music Festival'",
      date: "2023-07-05T18:45:00Z",
      read: true,
      type: "points",
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "achievement":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "points":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-purple-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Layout title="Notifications" showBackButton onBack={() => router.push("/profile")}>
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">Recent Notifications</h2>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Mark all as read
          </Button>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3 max-h-[420px] overflow-y-auto hide-scrollbar">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(notification.date)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">We'll notify you about new events and achievements</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Notifications
