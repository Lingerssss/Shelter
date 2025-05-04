"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"
import { useRouter } from "next/navigation"

const Home: React.FC = () => {
  const router = useRouter()

  return (
    <Layout title="Shelter">
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          Welcome to Shelter
        </h1>
        <p className="text-center text-sm text-gray-600">
          Connect with your campus community through events and activities.
        </p>
        <div className="space-y-4 w-full">
          <Link href="/signup" passHref>
            <Button className="w-full">Sign Up</Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="outline" className="w-full border-purple-500 text-purple-700 hover:bg-purple-100">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default Home
