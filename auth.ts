import { auth as clerkAuth } from "@clerk/nextjs/server"

// Re-export the auth function from Clerk
export const auth = clerkAuth

// For compatibility with existing code
export default {
  auth,
}
