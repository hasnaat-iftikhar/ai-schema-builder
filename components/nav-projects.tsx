"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Plus } from "lucide-react"

export function NavProjects() {
  const pathname = usePathname()

  // Mock projects data
  const projects = [
    { id: "1", name: "E-commerce Platform" },
    { id: "2", name: "Blog System" },
    { id: "3", name: "User Management" },
  ]

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xs font-semibold tracking-tight">Projects</h2>
        <Link href="/dashboard/projects/new">
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only">New Project</span>
          </Button>
        </Link>
      </div>
      <div className="space-y-1 py-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === `/dashboard/projects/${project.id}` ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <span className="flex items-center gap-3">
              <Database className="h-4 w-4" />
              <span className="truncate">{project.name}</span>
            </span>
            {project.id === "1" && (
              <Badge variant="outline" className="ml-2">
                New
              </Badge>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
