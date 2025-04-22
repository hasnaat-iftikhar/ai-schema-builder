"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavProjectsProps {
  projects?: {
    name: string
    url: string
  }[]
}

export function NavProjects({ projects = [] }: NavProjectsProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <FolderPlus className="h-4 w-4" />
          <span className="sr-only">Add Project</span>
        </Button>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => {
            const isActive = pathname === project.url

            return (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={project.url} className={cn("flex items-center gap-3")}>
                    <span>{project.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
