"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AnimatedBackground from "@/components/animated-background"

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatedBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Create an Account</h1>
            <p className="mt-2 text-gray-400">Sign up to start building your database schemas</p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                onClick={(e) => e.preventDefault()}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
