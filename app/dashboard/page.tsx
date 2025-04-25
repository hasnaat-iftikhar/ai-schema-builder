import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to the create project page
  redirect("/dashboard/projects/new")
}
