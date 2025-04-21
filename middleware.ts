import { authMiddleware } from "@clerk/nextjs"

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
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
  // Optional: Control how the middleware handles specific requests
  afterAuth(auth, req, evt) {
    // For public routes, just continue
    if (auth.isPublicRoute) {
      return
    }

    // If the user is logged in and trying to access a protected route, allow them
    if (auth.userId) {
      return
    }

    // If the user is not logged in and trying to access a protected route, redirect them to the login page
    const url = new URL("/login", req.url)
    return Response.redirect(url)
  },
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
