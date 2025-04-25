"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DiagramCanvas } from "@/components/diagram-canvas"
import { TablePropertiesDialog } from "@/components/table-properties-dialog"
import { TablesSidebar } from "@/components/tables-sidebar"

interface Column {
  name: string
  type: string
  isPrimary?: boolean
  isUnique?: boolean
  isForeign?: boolean
  references?: {
    table: string
    column: string
  }
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

interface DiagramEditorProps {
  tables: TableData[]
  relationships: Relationship[]
  onTablesChange: (tables: TableData[]) => void
  onRelationshipsChange: (relationships: Relationship[]) => void
}

export function DiagramEditor({ tables, relationships, onTablesChange, onRelationshipsChange }: DiagramEditorProps) {
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<TableData | null>(null)

  // Handle adding a new table
  const handleAddTable = () => {
    setEditingTable(null)
    setIsTableDialogOpen(true)
  }

  // Handle editing an existing table
  const handleEditTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (table) {
      setEditingTable(table)
      setIsTableDialogOpen(true)
    }
  }

  // Handle saving a table
  const handleSaveTable = (table: TableData) => {
    if (editingTable) {
      // Update existing table
      onTablesChange(tables.map((t) => (t.id === table.id ? table : t)))
    } else {
      // Add new table with timestamp-based ID to avoid conflicts
      const newTable = {
        ...table,
        id: `table-${Date.now()}`,
        x: Math.random() * 500,
        y: Math.random() * 300,
      }
      onTablesChange([...tables, newTable])
    }
    setIsTableDialogOpen(false)
  }

  // Handle deleting a table
  const handleDeleteTable = (tableId: string) => {
    onTablesChange(tables.filter((t) => t.id !== tableId))

    // Also remove any relationships connected to this table
    onRelationshipsChange(relationships.filter((r) => r.source !== tableId && r.target !== tableId))
  }

  // Handle adding a relationship
  const handleAddRelationship = (relationship: Relationship) => {
    // Generate a unique ID for the relationship
    const newRelationship = {
      ...relationship,
      id: `rel-${Date.now()}`,
      // Default to one-to-many if not specified
      type: relationship.type || "one-to-many",
    }
    onRelationshipsChange([...relationships, newRelationship])
  }

  // Handle deleting a relationship
  const handleDeleteRelationship = (relationshipId: string) => {
    onRelationshipsChange(relationships.filter((r) => r.id !== relationshipId))
  }

  return (
    <div className="flex h-full">
      <TablesSidebar tables={tables} onEditTable={handleEditTable} onDeleteTable={handleDeleteTable} />

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-medium">Schema Diagram</h2>
          <Button onClick={handleAddTable} className="bg-cryptic-accent text-black hover:bg-cryptic-accent/90 gap-2">
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <DiagramCanvas
            tables={tables}
            relationships={relationships}
            onEditTable={handleEditTable}
            onDeleteTable={handleDeleteTable}
            onAddRelationship={handleAddRelationship}
            onDeleteRelationship={handleDeleteRelationship}
          />
        </div>
      </div>

      <TablePropertiesDialog
        open={isTableDialogOpen}
        onOpenChange={setIsTableDialogOpen}
        table={editingTable}
        tables={tables}
        onSave={handleSaveTable}
      />
    </div>
  )
}
