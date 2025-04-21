"use client"

import { useEffect, useState } from "react"
import { getSession } from "@/auth-custom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const session = await getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Not signed in</div>
  }

  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
        <AvatarFallback>{user.name?.[0] || user.email[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.name || "User"}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  )
}
