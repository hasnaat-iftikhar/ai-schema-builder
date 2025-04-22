"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AnimatedBackground from "@/components/animated-background"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatedBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Login to AI Schema Builder</h1>
            <p className="mt-2 text-gray-400">Enter your credentials to access your account</p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-4">
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
                  autoComplete="current-password"
                  required
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="#" className="text-blue-400 hover:text-blue-300">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                onClick={(e) => e.preventDefault()}
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
