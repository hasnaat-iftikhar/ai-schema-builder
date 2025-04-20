import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser, unauthorized } from "@/lib/auth"
import type { Project } from "@/types/schema"

// GET /api/projects/[id] - Get a specific project
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    const projects = await sql<Project[]>`
      SELECT * FROM projects 
      WHERE id = ${params.projectId} AND user_id = ${user.id}
      LIMIT 1
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(projects[0])
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(req: NextRequest, { params }: { params: { projectId: string } }) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const now = new Date()

    const projects = await sql<Project[]>`
      UPDATE projects
      SET name = ${name}, description = ${description || null}, updated_at = ${now}
      WHERE id = ${params.projectId} AND user_id = ${user.id}
      RETURNING *
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(projects[0])
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(req: NextRequest, { params }: { params: { projectId: string } }) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    const result = await sql`
      DELETE FROM projects
      WHERE id = ${params.projectId} AND user_id = ${user.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
