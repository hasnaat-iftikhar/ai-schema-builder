import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser, unauthorized } from "@/lib/auth"
import type { Project, Table, Column, Relationship } from "@/types/schema"

// GET /api/projects/[id]/complete - Get a project with all its tables, columns, and relationships
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const user = await getCurrentUser(req)

  if (!user) {
    return unauthorized()
  }

  try {
    // Get the project
    const projects = await sql<Project[]>`
      SELECT * FROM projects 
      WHERE id = ${params.projectId} AND user_id = ${user.id}
      LIMIT 1
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    // Get all tables for the project
    const tables = await sql<Table[]>`
      SELECT * FROM tables 
      WHERE project_id = ${params.projectId}
    `

    // Get all columns for all tables
    const columns = await sql<Column[]>`
      SELECT c.* 
      FROM columns c
      JOIN tables t ON c.table_id = t.id
      WHERE t.project_id = ${params.projectId}
    `

    // Get all relationships for the project
    const relationships = await sql<Relationship[]>`
      SELECT * FROM relationships 
      WHERE project_id = ${params.projectId}
    `

    // Organize columns by table_id
    const columnsByTable: Record<string, Column[]> = {}
    columns.forEach((column) => {
      if (!columnsByTable[column.table_id]) {
        columnsByTable[column.table_id] = []
      }
      columnsByTable[column.table_id].push(column)
    })

    // Add columns to their respective tables
    const tablesWithColumns = tables.map((table) => ({
      ...table,
      columns: columnsByTable[table.id] || [],
    }))

    // Return the complete project data
    return NextResponse.json({
      ...project,
      tables: tablesWithColumns,
      relationships,
    })
  } catch (error) {
    console.error("Error fetching complete project:", error)
    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 })
  }
}
