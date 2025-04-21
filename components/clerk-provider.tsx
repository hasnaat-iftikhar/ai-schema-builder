"use client"

import type React from "react"

import { ClerkProvider as BaseClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: "bg-cryptic-accent text-black hover:bg-cryptic-accent/90",
          card: "bg-cryptic-card border-cryptic-border",
          formFieldInput: "bg-cryptic-card border-cryptic-border",
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  )
}
