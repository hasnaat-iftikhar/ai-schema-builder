import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  // Log API requests
  if (request.nextUrl.pathname.startsWith("/api/")) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`)

    // Protect API routes except auth routes
    if (!request.nextUrl.pathname.startsWith("/api/auth/")) {
      const session = await auth()

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const session = await auth()

    if (!session) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages and root to dashboard
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup")
  ) {
    const session = await auth()

    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/api/:path*", "/dashboard/:path*", "/login", "/signup"],
}
