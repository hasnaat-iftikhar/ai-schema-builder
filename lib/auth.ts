import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function getCurrentUser(req?: NextRequest) {
  const session = await auth()
  return session?.user || null
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
