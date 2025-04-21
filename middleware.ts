import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/login",
    "/signup",
    "/api/health",
    // Add any other public routes here
  ],
  // Routes that can always be accessed, and have no authentication information
  ignoredRoutes: [
    "/api/health",
    // Add any routes that should bypass authentication checks completely
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
