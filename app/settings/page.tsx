"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const Settings: React.FC = () => {
  const router = useRouter()
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    language: "english",
  })

  const handleToggleChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSelectChange = (setting: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSave = () => {
    // In a real app, you would save these settings to your backend
    console.log("Saving settings:", settings)

    // Show success message or redirect
    router.push("/profile")
  }

  return (
    <Layout title="Settings" showBackButton onBack={() => router.push("/profile")}>
      <div className="space-y-3 max-h-full">
        <Card>
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">
                Display Name
              </Label>
              <Input id="name" defaultValue="John Doe" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input id="email" defaultValue="john.doe@university.edu" disabled className="h-8 text-sm" />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex-1 text-sm">
                Push Notifications
                <span className="block text-xs text-gray-500">Receive notifications about events</span>
              </Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleToggleChange("notifications")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailUpdates" className="flex-1 text-sm">
                Email Updates
                <span className="block text-xs text-gray-500">Receive email updates about new events</span>
              </Label>
              <Switch
                id="emailUpdates"
                checked={settings.emailUpdates}
                onCheckedChange={() => handleToggleChange("emailUpdates")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex-1 text-sm">
                Dark Mode
                <span className="block text-xs text-gray-500">Use dark theme for the app</span>
              </Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggleChange("darkMode")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="language" className="text-xs">
                Language
              </Label>
              <Select value={settings.language} onValueChange={(value) => handleSelectChange("language", value)}>
                <SelectTrigger id="language" className="h-8 text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </Layout>
  )
}

export default Settings
