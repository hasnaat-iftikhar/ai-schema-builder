"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate logout
    setTimeout(() => {
      router.push("/login")
    }, 500)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-cryptic-background p-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we log you out.</p>
      </div>
    </div>
  )
}
