import { redirect } from "next/navigation"

export default function DashboardPage() {
  redirect("/dashboard/projects/new")

  // This code will never run due to the redirect
  return null
}
