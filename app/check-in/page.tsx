"use client"

import type React from "react"
import Layout from "@/components/Layout"
import { useRouter } from "next/navigation"

const CheckIn: React.FC = () => {
  const router = useRouter()
  // ... rest of the component code ...

  return (
    <Layout title="Event Check-in" showBackButton onBack={() => router.push("/recommendations")}>
      {/* ... rest of the component JSX ... */}
    </Layout>
  )
}

export default CheckIn
