"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Compass, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const BottomNav: React.FC = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/discover", icon: Compass, label: "Discover" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="flex items-center justify-between h-16 px-2">
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-purple-600",
              pathname === item.href && "text-purple-600",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        ))}
        <div className="flex-shrink-0">
          <Link href="/create-event" passHref>
            <Button
              size="icon"
              className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 -mt-8 w-14 h-14"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Create Event</span>
            </Button>
          </Link>
        </div>
        {navItems.slice(2, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-14 h-14 text-gray-600 hover:text-purple-600",
              pathname === item.href && "text-purple-600",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
