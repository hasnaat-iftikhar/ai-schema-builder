"use server"

import bcrypt from "bcryptjs"
import { sql } from "./db"
import { generateId } from "./db"
import { signIn } from "@/auth"
import { redirect } from "next/navigation"

interface RegisterUserData {
  name: string
  email: string
  password: string
}

export async function registerUser(data: RegisterUserData) {
  const { name, email, password } = data

  try {
    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `

    if (existingUsers.length > 0) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = generateId()
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
    `

    return { success: true, userId }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, error: "Failed to register user" }
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const result = await signIn("credentials", { email, password, redirect: false })

    if (result?.error) {
      return { success: false, error: "Invalid credentials" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function signInAndRedirect(provider: string, data?: Record<string, any>) {
  await signIn(provider, { ...data, redirectTo: "/dashboard" })
  redirect("/dashboard")
}
