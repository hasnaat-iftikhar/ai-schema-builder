import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
