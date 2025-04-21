"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught in error boundary:", error)
      setHasError(true)
      setError(error.error)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
        <p className="mt-4 text-gray-400">{error?.message || "An unknown error occurred"}</p>
        <button
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    )
  }

  return <>{children}</>
}
