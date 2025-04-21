"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by error.tsx:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
      <p className="mt-4 text-gray-400">{error?.message || "An unknown error occurred"}</p>
      {error?.digest && <p className="mt-2 text-sm text-gray-500">Error ID: {error.digest}</p>}
      <Button
        className="mt-4"
        onClick={() => {
          reset()
        }}
      >
        Try again
      </Button>
    </div>
  )
}
