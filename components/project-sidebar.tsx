"use client"

import { GalleryVerticalEnd, LayoutDashboard, FileCode, FileText, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface ProjectSidebarProps {
  projectName: string
  activeView: string
  onViewChange: (view: string) => void
}

export function ProjectSidebar({ projectName, activeView, onViewChange }: ProjectSidebarProps) {
  const navItems = [
    {
      title: "Diagram",
      icon: LayoutDashboard,
      id: "diagram",
    },
    {
      title: "Schema Code",
      icon: FileCode,
      id: "schema-code",
    },
    {
      title: "Documentation",
      icon: FileText,
      id: "documentation",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  return (
    <Sidebar variant="inset" className="border-r border-white/10">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex justify-start items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cryptic-accent text-black">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AI Schema Builder</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">{projectName || "New Project"}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild isActive={activeView === item.id}>
                  <button
                    className="rounded-[8px] h-[42px] px-[16px] flex justify-start items-center gap-3 hover:bg-[#ffffff1a]"
                    onClick={() => onViewChange(item.id)}
                  >
                    <item.icon width={16} height={16} />
                    <span className="text-sm">{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* Footer content if needed */}</SidebarFooter>
    </Sidebar>
  )
}
