"use client"

import type React from "react"

import { ClerkProvider as ClerkProviderOriginal } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <ClerkProviderOriginal
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "#0ea5e9",
        },
      }}
    >
      {children}
    </ClerkProviderOriginal>
  )
}
