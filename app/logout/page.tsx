"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      await signOut({ redirect: false })
      router.push("/login")
    }

    handleLogout()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-cryptic-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-muted-foreground">You will be redirected shortly.</p>
      </div>
    </div>
  )
}
