import { SignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

export default async function LoginPage() {
  const { userId } = auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-background border border-border shadow-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-muted text-foreground border border-border hover:bg-muted/80",
              dividerLine: "bg-border",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border border-input text-foreground",
              footerActionLink: "text-primary hover:text-primary/80",
            },
          }}
          redirectUrl="/dashboard"
          signUpUrl="/signup"
        />
      </div>
    </div>
  )
}
