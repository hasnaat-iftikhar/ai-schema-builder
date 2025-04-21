"use client"

import { useAuth as useClerkAuth } from "@clerk/nextjs"

export const useAuth = () => {
  const { isLoaded, isSignedIn, userId } = useClerkAuth()

  return {
    isLoaded,
    isAuthenticated: isSignedIn,
    user: isSignedIn ? { id: userId } : null,
    // Add any other properties that might be expected by the existing code
  }
}

export default useAuth
