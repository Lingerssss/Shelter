"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Layout from "@/components/Layout"
import { useRouter } from "next/navigation"
import Modal from "@/components/Modal"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const router = useRouter()

  const isStudentEmail = (email: string) => {
    // This is a simple check. You might want to expand this to include more student email domains.
    return email.endsWith(".edu") || email.includes("student")
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isStudentEmail(email)) {
      setModalTitle("Invalid Email")
      setModalMessage("Please use a valid student email address to sign up.")
      setIsModalOpen(true)
      return
    }

    if (password !== confirmPassword) {
      setModalTitle("Password Mismatch")
      setModalMessage("The passwords you entered do not match. Please try again.")
      setIsModalOpen(true)
      return
    }

    // Sign up logic would go here
    console.log("Sign up with:", email, password)

    // Show success message
    setModalTitle("Registration Successful")
    setModalMessage("Your account has been created successfully! You can now log in.")
    setIsModalOpen(true)

    // After successful sign up and modal close, navigate to login page
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  return (
    <Layout title="Sign Up" showBackButton onBack={() => router.push("/")}>
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Join Shelter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Student Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">Only valid student emails are accepted</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} message={modalMessage} />
    </Layout>
  )
}

export default SignUp
