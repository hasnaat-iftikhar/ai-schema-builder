import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function LoginPage() {
  const { userId } = auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6",
              headerTitle: "text-2xl font-bold text-center",
              headerSubtitle: "text-center",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            },
          }}
        />
      </div>
    </div>
  )
}
