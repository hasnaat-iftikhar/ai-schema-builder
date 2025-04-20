import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { sql } from "@/lib/db"
import type { User } from "@/types/schema"
import { NeonAdapter } from "@/lib/auth-adapter"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: NeonAdapter(),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const users = await sql<(User & { password: string | null })[]>`
            SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1
          `

          if (users.length === 0) {
            return null
          }

          const user = users[0]

          // Check if user has a password (might be using OAuth)
          if (!user.password) {
            console.error("User exists but has no password (likely using OAuth)")
            return null
          }

          // Compare password
          const passwordMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        } catch (error) {
          console.error("Error during authentication:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login", // Error code passed in query string as ?error=
    verifyRequest: "/verify-request", // (used for check email message)
    newUser: "/signup", // New users will be directed here on first sign in
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})

// Add types for NextAuth
declare module "next-auth" {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}
