import type React from "react"
import "@/app/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "AI Schema Builder",
  description: "Build database schemas with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={cn("min-h-screen bg-background font-sans antialiased", manrope.variable, inter.variable)}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  )
}
