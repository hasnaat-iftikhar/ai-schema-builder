import type React from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { NavSecondary } from "@/components/nav-secondary"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    redirect("/login")
  }

  const user = await currentUser()

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <NavSecondary user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
