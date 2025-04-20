import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser, unauthorized } from "@/lib/auth"
import type { Table, Project } from "@/types/schema"
import { generateId } from "@/lib/db"

// GET /api/projects/[projectId]/tables - Get all tables for a project
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

    const tables = await sql<Table[]>`
      SELECT * FROM tables 
      WHERE project_id = ${params.projectId}
      ORDER BY name
    `

    return NextResponse.json(tables)
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 })
  }
}

// POST /api/projects/[projectId]/tables - Create a new table
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

    const { name, x, y } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Table name is required" }, { status: 400 })
    }

    const tableId = generateId()

    const table = await sql<Table[]>`
      INSERT INTO tables (id, name, x, y, project_id)
      VALUES (${tableId}, ${name}, ${x || 0}, ${y || 0}, ${params.projectId})
      RETURNING *
    `

    // Update the project's updated_at timestamp
    await sql`
      UPDATE projects
      SET updated_at = NOW()
      WHERE id = ${params.projectId}
    `

    return NextResponse.json(table[0])
  } catch (error) {
    console.error("Error creating table:", error)
    return NextResponse.json({ error: "Failed to create table" }, { status: 500 })
  }
}
