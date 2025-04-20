import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Star, Users } from "lucide-react"

const communityProjects = [
  {
    id: "1",
    name: "Social Media Platform",
    author: "Jane Smith",
    description: "Complete database schema for a social media application with users, posts, comments, and likes.",
    stars: 124,
    forks: 32,
    updatedAt: "1 day ago",
  },
  {
    id: "2",
    name: "Hospital Management System",
    author: "Dr. Robert Chen",
    description: "Healthcare database with patients, doctors, appointments, and medical records.",
    stars: 87,
    forks: 15,
    updatedAt: "3 days ago",
  },
  {
    id: "3",
    name: "Learning Management System",
    author: "Education Tech Group",
    description: "Schema for online courses, students, instructors, and assignments.",
    stars: 56,
    forks: 8,
    updatedAt: "1 week ago",
  },
  {
    id: "4",
    name: "Real Estate Database",
    author: "Property Solutions",
    description: "Property listings, agents, buyers, and transactions for a real estate application.",
    stars: 42,
    forks: 7,
    updatedAt: "2 weeks ago",
  },
  {
    id: "5",
    name: "Inventory Management",
    author: "Supply Chain Solutions",
    description: "Complete inventory tracking system with products, suppliers, warehouses, and orders.",
    stars: 38,
    forks: 5,
    updatedAt: "3 weeks ago",
  },
]

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Community Projects</h2>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" /> Browse All
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {communityProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>by {project.author}</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="mr-1 h-3.5 w-3.5" />
                    {project.stars}
                  </div>
                  <div className="flex items-center">
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    {project.forks}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">Updated {project.updatedAt}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="w-full">
                View Project
              </Button>
              <Button className="w-full">Clone</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
