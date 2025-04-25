"use client"

import { useState } from "react"
import { ProjectSidebar } from "@/components/project-sidebar"
import { DiagramEditor } from "@/components/diagram-editor"
import { CodeView } from "@/components/code-view"
import { DocumentationPanel } from "@/components/documentation-panel"

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
  type?: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many"
}

interface ViewSwitcherProps {
  projectName?: string
}

export function ViewSwitcher({ projectName = "New Project" }: ViewSwitcherProps) {
  const [activeView, setActiveView] = useState("diagram")
  const [tables, setTables] = useState<TableData[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])

  const handleViewChange = (view: string) => {
    setActiveView(view)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ProjectSidebar projectName={projectName} activeView={activeView} onViewChange={handleViewChange} />

      <div className="flex-1 overflow-hidden">
        {activeView === "diagram" && (
          <DiagramEditor
            tables={tables}
            relationships={relationships}
            onTablesChange={setTables}
            onRelationshipsChange={setRelationships}
          />
        )}
        {activeView === "schema-code" && <CodeView tables={tables} relationships={relationships} />}
        {activeView === "documentation" && <DocumentationPanel tables={tables} relationships={relationships} />}
      </div>
    </div>
  )
}
