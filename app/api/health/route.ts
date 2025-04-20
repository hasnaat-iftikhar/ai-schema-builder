import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Test the database connection
    const result = await sql`SELECT NOW() as time`

    return NextResponse.json({
      status: "ok",
      database: "connected",
      serverTime: result[0].time,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
