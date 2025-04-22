import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border shadow">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <p className="text-muted-foreground mb-4">You have 0 projects</p>
          <Link href="/dashboard/projects/new">
            <Button>Create New Project</Button>
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow">
          <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
          <p className="text-muted-foreground">No recent activity</p>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Import Schema
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Browse Templates
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full text-primary">1</div>
            <div>
              <h3 className="font-medium">Create a new project</h3>
              <p className="text-muted-foreground">Start by creating a new database schema project</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full text-primary">2</div>
            <div>
              <h3 className="font-medium">Add tables and relationships</h3>
              <p className="text-muted-foreground">Design your database structure with our visual editor</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full text-primary">3</div>
            <div>
              <h3 className="font-medium">Generate code</h3>
              <p className="text-muted-foreground">Export your schema to SQL, Prisma, or other formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
