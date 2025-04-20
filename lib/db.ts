import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
