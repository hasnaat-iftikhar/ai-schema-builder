"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, FileText } from "lucide-react"

interface ProjectSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProjectSidebar({ activeTab, onTabChange }: ProjectSidebarProps) {
  return (
    <div className="w-[240px] border-r border-white/10 bg-cryptic-card flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium">Project</h2>
      </div>
      <Tabs value={activeTab} className="w-full" onValueChange={onTabChange}>
        <TabsList className="flex flex-col h-auto bg-transparent p-0 w-full">
          <TabsTrigger
            value="diagram"
            className="justify-start px-4 py-2 data-[state=active]:bg-cryptic-accent/20 data-[state=active]:text-cryptic-accent rounded-none w-full"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Diagram
          </TabsTrigger>
          <TabsTrigger
            value="documentation"
            className="justify-start px-4 py-2 data-[state=active]:bg-cryptic-accent/20 data-[state=active]:text-cryptic-accent rounded-none w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
