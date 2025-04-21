"use client"

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs"

export function useAuth() {
  const { isLoaded, userId, sessionId, isSignedIn } = useClerkAuth()
  const { user } = useUser()

  return {
    isLoaded,
    isAuthenticated: isSignedIn,
    user: user
      ? {
          id: userId || "",
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          image: user.imageUrl || "",
        }
      : null,
    sessionId,
  }
}

export default useAuth
