import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser, unauthorized } from "@/lib/auth"
import type { Project } from "@/types/schema"
import { generateId } from "@/lib/db"

// GET /api/projects - Get all projects for the current user
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    const projects = await sql<Project[]>`
      SELECT * FROM projects 
      WHERE user_id = ${user.id}
      ORDER BY updated_at DESC
    `

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const projectId = generateId()
    const now = new Date()

    const project = await sql<Project[]>`
      INSERT INTO projects (id, name, description, user_id, created_at, updated_at)
      VALUES (${projectId}, ${name}, ${description || null}, ${user.id}, ${now}, ${now})
      RETURNING *
    `

    return NextResponse.json(project[0])
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
