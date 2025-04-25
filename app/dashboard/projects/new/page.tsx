"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project-sidebar"
import { CodeView } from "@/components/code-view"
import { DocumentationPanel } from "@/components/documentation-panel"
import { SettingsPanel } from "@/components/settings-panel"

interface Column {
  name: string
  type: string
  isPrimary?: boolean
  isUnique?: boolean
  isForeign?: boolean
}

interface TableData {
  id: string
  name: string
  x: number
  y: number
  columns: Column[]
}

interface Relationship {
  id: string
  source: string
  target: string
  sourceKey: string
  targetKey: string
  through?: string
}

export default function CreateProjectPage() {
  const searchParams = useSearchParams()
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [activeView, setActiveView] = useState("diagram")
  const [tables, setTables] = useState<TableData[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])

  // Get project details from URL parameters if available
  useEffect(() => {
    const name = searchParams.get("name")
    const description = searchParams.get("description")

    if (name) setProjectName(name)
    if (description) setProjectDescription(description)
  }, [searchParams])

  // Handle project settings update
  const handleProjectUpdate = (name: string, description: string) => {
    setProjectName(name)
    setProjectDescription(description)
  }

  // Render the active view
  const renderActiveView = () => {
    switch (activeView) {
      case "diagram":
      case "schema-code":
        return (
          <CodeView
            tables={tables}
            relationships={relationships}
            onTablesChange={setTables}
            onRelationshipsChange={setRelationships}
          />
        )
      case "documentation":
        return <DocumentationPanel tables={tables} relationships={relationships} />
      case "settings":
        return (
          <SettingsPanel
            projectName={projectName}
            projectDescription={projectDescription}
            onUpdate={handleProjectUpdate}
          />
        )
      default:
        return (
          <CodeView
            tables={tables}
            relationships={relationships}
            onTablesChange={setTables}
            onRelationshipsChange={setRelationships}
          />
        )
    }
  }

  return (
    <SidebarProvider>
      <ProjectSidebar projectName={projectName} activeView={activeView} onViewChange={setActiveView} />
      <SidebarInset className="bg-cryptic-background">
        <header className="flex h-16 items-center gap-4 border-b border-white/10 px-6">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Schema Designer</h1>
        </header>
        <div className="flex flex-1 h-[calc(100vh-64px)] w-full">{renderActiveView()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
