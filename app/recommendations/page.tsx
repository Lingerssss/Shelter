"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import Link from "next/link"

const mockEvents = [
  { id: 1, title: "Event 1", description: "Description 1" },
  { id: 2, title: "Event 2", description: "Description 2" },
  { id: 3, title: "Event 3", description: "Description 3" },
]

const EventCard: React.FC<{ event: { id: number; title: string; description: string } }> = ({ event }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{event.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button>View Event</Button>
      </CardFooter>
    </Card>
  )
}

const Recommendations: React.FC = () => {
  return (
    <Layout title="Recommended Events">
      <div className="space-y-4">
        <Link href="/create-event" passHref>
          <Button className="w-full mb-4">Create New Event</Button>
        </Link>
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Layout>
  )
}

export default Recommendations
