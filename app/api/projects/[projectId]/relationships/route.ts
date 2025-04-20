import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser, unauthorized } from "@/lib/auth"
import type { Relationship, Project } from "@/types/schema"
import { generateId } from "@/lib/db"

// GET /api/projects/[projectId]/relationships - Get all relationships for a project
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    // First check if the project belongs to the user
    const projects = await sql<Project[]>`
      SELECT id FROM projects 
      WHERE id = ${params.projectId} AND user_id = ${user.id}
      LIMIT 1
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const relationships = await sql<Relationship[]>`
      SELECT * FROM relationships 
      WHERE project_id = ${params.projectId}
    `

    return NextResponse.json(relationships)
  } catch (error) {
    console.error("Error fetching relationships:", error)
    return NextResponse.json({ error: "Failed to fetch relationships" }, { status: 500 })
  }
}

// POST /api/projects/[projectId]/relationships - Create a new relationship
export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    // First check if the project belongs to the user
    const projects = await sql<Project[]>`
      SELECT id FROM projects 
      WHERE id = ${params.projectId} AND user_id = ${user.id}
      LIMIT 1
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const { source_id, target_id, source_key, target_key, through, type } = await req.json()

    if (!source_id || !target_id || !source_key || !target_key) {
      return NextResponse.json(
        {
          error: "Source ID, target ID, source key, and target key are required",
        },
        { status: 400 },
      )
    }

    const relationshipId = generateId()

    const relationship = await sql<Relationship[]>`
      INSERT INTO relationships (
        id, source_id, target_id, source_key, target_key, through, type, project_id
      )
      VALUES (
        ${relationshipId}, 
        ${source_id}, 
        ${target_id}, 
        ${source_key}, 
        ${target_key}, 
        ${through || null}, 
        ${type || null}, 
        ${params.projectId}
      )
      RETURNING *
    `

    // Update the project's updated_at timestamp
    await sql`
      UPDATE projects
      SET updated_at = NOW()
      WHERE id = ${params.projectId}
    `

    return NextResponse.json(relationship[0])
  } catch (error) {
    console.error("Error creating relationship:", error)
    return NextResponse.json({ error: "Failed to create relationship" }, { status: 500 })
  }
}
