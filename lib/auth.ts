import { type NextRequest, NextResponse } from "next/server"

// Mock function to get the current user
export async function getCurrentUser(req: NextRequest) {
  // In a real application, this would fetch the user from the database
  // based on the session or authentication token in the request headers.
  // For this demo, we'll just return a mock user.
  return {
    id: "test-user-id",
    name: "John Doe",
    email: "john@example.com",
    image: "/avatars/john-doe.jpg",
  }
}

// Helper function to return an unauthorized response
export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
