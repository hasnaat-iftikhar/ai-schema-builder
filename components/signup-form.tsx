"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignupForm() {
  return (
    <div className="w-full max-w-md">
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-cryptic-card border-cryptic-border",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-muted text-foreground border-border hover:bg-muted/80",
            dividerLine: "bg-border",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-cryptic-background border-input text-foreground",
            footerActionLink: "text-primary hover:text-primary/80",
          },
        }}
        redirectUrl="/dashboard"
        signInUrl="/login"
      />
    </div>
  )
}
