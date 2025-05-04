"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Layout from "@/components/Layout"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CreateEvent: React.FC = () => {
  const router = useRouter()
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "",
    maxParticipants: "",
    checkInPoints: "10",
    image: null as File | null,
  })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEventDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventDetails((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create event object with all details including tags
    const newEvent = {
      ...eventDetails,
      id: Date.now().toString(), // Generate a unique ID
      tags,
    }

    // In a real app, you would send this to your backend
    console.log("Event details:", newEvent)

    // For demo purposes, let's store it in localStorage
    try {
      const events = JSON.parse(localStorage.getItem("allEvents") || "{}")
      events[newEvent.id] = {
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        description: newEvent.description,
        type: newEvent.type,
        maxParticipants: Number.parseInt(newEvent.maxParticipants),
        checkInPoints: Number.parseInt(newEvent.checkInPoints),
        tags: newEvent.tags,
      }
      localStorage.setItem("allEvents", JSON.stringify(events))

      // Dispatch event to notify other components
      window.dispatchEvent(new Event("eventsUpdated"))
    } catch (e) {
      console.error("Error saving event", e)
    }

    // Navigate to the events list
    router.push("/dashboard")
  }

  return (
    <Layout title="Create Event" showBackButton onBack={() => router.push("/dashboard")}>
      <div className="min-h-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4">
        <Card className="w-full bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center text-purple-700">Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={eventDetails.title}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={eventDetails.description}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={eventDetails.date}
                    onChange={handleChange}
                    required
                    className="bg-white"
                    lang="en-US"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={eventDetails.time}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select name="type" onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags/Keywords</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="rounded-full hover:bg-gray-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag} tag</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags (press Enter to add)"
                  className="bg-white"
                />
                <p className="text-xs text-gray-500">
                  Add keywords that describe your event (e.g., music, technology, networking)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    value={eventDetails.maxParticipants}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkInPoints">Check-in Points</Label>
                  <Input
                    id="checkInPoints"
                    name="checkInPoints"
                    type="number"
                    value={eventDetails.checkInPoints}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                Create Event
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default CreateEvent
