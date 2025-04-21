"use client"

import type React from "react"

import { ClerkProvider as ClerkProviderOriginal } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderOriginal
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "hsl(var(--cryptic-accent))",
          colorText: "white",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--cryptic-card))",
          colorInputText: "white",
        },
        elements: {
          formButtonPrimary: "bg-cryptic-accent text-black hover:bg-cryptic-accent/90",
          card: "bg-cryptic-card border-cryptic-border",
          formFieldInput: "bg-cryptic-card border-cryptic-border",
        },
      }}
    >
      {children}
    </ClerkProviderOriginal>
  )
}
