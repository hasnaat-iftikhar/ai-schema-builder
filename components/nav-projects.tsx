"use client"

import { Trash2 } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu className="flex flex-col gap-1">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name} className="">
            <a
              href={item.url}
              className="group text-sm rounded-[8px] h-[42px] px-[16px] flex justify-start items-center gap-3 hover:bg-[#ffffff1a]"
            >
              <span className="flex-1">{item.name}</span>

              <Trash2 className="opacity-0 group-hover:opacity-100 text-red-500" width={16} height={16} />
            </a>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
