import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser, unauthorized } from "@/lib/auth"
import type { Column, Table, Project } from "@/types/schema"
import { generateId } from "@/lib/db"

// GET /api/projects/[projectId]/tables/[tableId]/columns - Get all columns for a table
export async function GET(req: NextRequest, { params }: { params: { projectId: string; tableId: string } }) {
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

    // Then check if the table belongs to the project
    const tables = await sql<Table[]>`
      SELECT id FROM tables 
      WHERE id = ${params.tableId} AND project_id = ${params.projectId}
      LIMIT 1
    `

    if (tables.length === 0) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    const columns = await sql<Column[]>`
      SELECT * FROM columns 
      WHERE table_id = ${params.tableId}
      ORDER BY name
    `

    return NextResponse.json(columns)
  } catch (error) {
    console.error("Error fetching columns:", error)
    return NextResponse.json({ error: "Failed to fetch columns" }, { status: 500 })
  }
}

// POST /api/projects/[projectId]/tables/[tableId]/columns - Create a new column
export async function POST(req: NextRequest, { params }: { params: { projectId: string; tableId: string } }) {
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

    // Then check if the table belongs to the project
    const tables = await sql<Table[]>`
      SELECT id FROM tables 
      WHERE id = ${params.tableId} AND project_id = ${params.projectId}
      LIMIT 1
    `

    if (tables.length === 0) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    const { name, type, is_primary, is_unique, is_foreign } = await req.json()

    if (!name || !type) {
      return NextResponse.json({ error: "Column name and type are required" }, { status: 400 })
    }

    const columnId = generateId()

    const column = await sql<Column[]>`
      INSERT INTO columns (id, name, type, is_primary, is_unique, is_foreign, table_id)
      VALUES (
        ${columnId}, 
        ${name}, 
        ${type}, 
        ${is_primary || false}, 
        ${is_unique || false}, 
        ${is_foreign || false}, 
        ${params.tableId}
      )
      RETURNING *
    `

    // Update the project's updated_at timestamp
    await sql`
      UPDATE projects
      SET updated_at = NOW()
      WHERE id = ${params.projectId}
    `

    return NextResponse.json(column[0])
  } catch (error) {
    console.error("Error creating column:", error)
    return NextResponse.json({ error: "Failed to create column" }, { status: 500 })
  }
}
