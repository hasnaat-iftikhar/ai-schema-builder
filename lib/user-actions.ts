"use server"

import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function registerUser(formData: { name: string; email: string; password: string }) {
  try {
    // Validate form data
    const validatedFields = userSchema.parse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${validatedFields.email}
    `

    if (existingUsers.length > 0) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedFields.password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${validatedFields.name}, ${validatedFields.email}, ${hashedPassword})
      RETURNING id, name, email
    `

    const newUser = result[0]

    return { success: true, user: newUser }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create user" }
  }
}
