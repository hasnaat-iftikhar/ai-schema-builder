"use client"

import { ProjectsTable } from "@/components/projects-table"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export default function DashboardPage() {
  // Sample user data - in a real app, this would come from authentication
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  }

  return (
    <div className="min-h-screen bg-cryptic-background">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Column */}
          <div className="space-y-6">
            <div className="bg-cryptic-card border border-white/10 rounded-lg p-4">
              <UserProfileDropdown user={user} />
            </div>

            <div className="bg-cryptic-card border border-white/10 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Create New Project</h2>
              <p className="text-sm text-gray-400 mb-4">
                Start building your database schema by creating a new project.
              </p>
              <CreateProjectDialog fullWidth />
            </div>
          </div>

          {/* Second Column */}
          <div className="md:col-span-2">
            <div className="bg-cryptic-card border border-white/10 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Your Projects</h2>
              <ProjectsTable simplified />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
