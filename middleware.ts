import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/login", "/signup", "/api/health"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
