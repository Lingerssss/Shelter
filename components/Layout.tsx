"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Home } from 'lucide-react'
import BottomNav from "./BottomNav"

interface LayoutProps {
  children: React.ReactNode
  title: string
  showBackButton?: boolean
  onBack?: () => void
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBackButton = false, onBack }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[320px] h-[568px] bg-white overflow-hidden flex flex-col shadow-lg rounded-2xl relative">
        <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton ? (
              <button onClick={onBack} className="mr-3">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <Link href="/" className="mr-3">
                <Home size={20} />
              </Link>
            )}
            <h1 className="text-base font-bold">{title}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-3 bg-gradient-to-br from-purple-100 to-blue-100 hide-scrollbar">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default Layout
