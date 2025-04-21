import { authMiddleware } from "@clerk/nextjs"

// Export a minimal middleware configuration to start
export default authMiddleware({
  // Make all routes public temporarily to isolate the issue
  publicRoutes: ["/(.*)", "/api/(.*)"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
