"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"

export default function LogoutPage() {
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    const performSignOut = async () => {
      await signOut()
      router.push("/login")
    }

    performSignOut()
  }, [signOut, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="text-lg">Signing out...</p>
    </div>
  )
}
