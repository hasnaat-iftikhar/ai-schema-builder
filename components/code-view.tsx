"use client"

import { useState, useEffect } from "react"
import { ViewSwitcher } from "@/components/view-switcher"
import { DiagramCanvas } from "@/components/diagram-canvas"
import { SchemaCodePanel } from "@/components/schema-code-panel"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { TablesSidebar } from "@/components/tables-sidebar"
import { TablePropertiesDialog } from "@/components/table-properties-dialog"

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

interface CodeViewProps {
  tables: TableData[]
  relationships: Relationship[]
  onTablesChange: (tables: TableData[]) => void
  onRelationshipsChange: (relationships: Relationship[]) => void
}

export function CodeView({ tables, relationships, onTablesChange, onRelationshipsChange }: CodeViewProps) {
  const [activeSubView, setActiveSubView] = useState<"diagram" | "code">("diagram")
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [newTableCreated, setNewTableCreated] = useState<string | null>(null)
  const [schemaCode, setSchemaCode] = useState<string>("")

  // Get the selected table data
  const selectedTableData = selectedTable ? tables.find((t) => t.id === selectedTable) || null : null

  // Function to update a table
  const handleTableUpdate = (updatedTable: TableData) => {
    onTablesChange(tables.map((table) => (table.id === updatedTable.id ? updatedTable : table)))
  }

  // Auto-open properties dialog when a new table is created
  useEffect(() => {
    if (newTableCreated) {
      setSelectedTable(newTableCreated)
      setPropertiesOpen(true)
      setNewTableCreated(null)
    }
  }, [newTableCreated])

  // Update code when tables or relationships change
  useEffect(() => {
    // Generate initial code when switching to code view or when tables/relationships change
    if (activeSubView === "code" || tables.length > 0 || relationships.length > 0) {
      // We'll generate a default code representation based on the current state
      const generateInitialCode = () => {
        // Default to Prisma format for initial code
        const prismaCode = generatePrismaCode(tables, relationships)
        setSchemaCode(prismaCode)
      }

      generateInitialCode()
    }
  }, [tables, relationships, activeSubView])

  // Helper function to generate initial Prisma code
  const generatePrismaCode = (tables: TableData[], relationships: Relationship[]) => {
    if (tables.length === 0) {
      return `// Prisma schema
      
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add tables to your diagram to generate Prisma schema
`
    }

    let code = `// Prisma schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`

    // Add models for each table
    tables.forEach((table) => {
      code += `model ${table.name} {
  ${table.columns
    .map((col) => {
      let type =
        col.type === "integer"
          ? "Int"
          : col.type === "varchar"
            ? "String"
            : col.type === "text"
              ? "String"
              : col.type === "boolean"
                ? "Boolean"
                : col.type === "timestamp"
                  ? "DateTime"
                  : col.type === "uuid"
                    ? "String"
                    : "String"

      if (col.isPrimary) {
        if (col.type === "uuid") {
          type += " @id @default(uuid())"
        } else if (col.type === "integer") {
          type += " @id @default(autoincrement())"
        } else {
          type += " @id"
        }
      }

      if (col.isUnique) {
        type += " @unique"
      }

      return `${col.name} ${type}`
    })
    .join("\n  ")}
}

`
    })

    return code
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <ViewSwitcher activeView={activeSubView} onViewChange={setActiveSubView} />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              const newId = `t${tables.length + 1}`
              const newTable: TableData = {
                id: newId,
                name: "Untitled",
                x: 100,
                y: 100,
                columns: [],
              }
              onTablesChange([...tables, newTable])
              setNewTableCreated(newId) // Set the new table ID to trigger auto-open
            }}
            className="bg-cryptic-accent text-black hover:bg-cryptic-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Table
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="flex flex-1 w-full">
        {activeSubView === "diagram" && (
          <div className="flex flex-1">
            <DiagramCanvas
              tables={tables}
              relationships={relationships}
              onTablesChange={onTablesChange}
              onRelationshipsChange={onRelationshipsChange}
              onTableSelect={setSelectedTable}
            />
            <TablesSidebar
              tables={tables}
              onTableSelect={(tableId) => {
                // Select the table and open the properties dialog
                setSelectedTable(tableId)
                setPropertiesOpen(true)
              }}
              onTableDelete={(tableId) => {
                // Remove the table
                onTablesChange(tables.filter((t) => t.id !== tableId))
                // Also remove any relationships involving this table
                onRelationshipsChange(relationships.filter((r) => r.source !== tableId && r.target !== tableId))
              }}
            />
          </div>
        )}
        {activeSubView === "code" && (
          <SchemaCodePanel
            tables={tables}
            relationships={relationships}
            onTablesChange={onTablesChange}
            onRelationshipsChange={onRelationshipsChange}
            code={schemaCode}
            onCodeChange={setSchemaCode}
          />
        )}
      </div>

      {/* Table Properties Dialog */}
      <TablePropertiesDialog
        open={propertiesOpen}
        onOpenChange={setPropertiesOpen}
        table={selectedTableData}
        onTableUpdate={handleTableUpdate}
        tables={tables}
        relationships={relationships}
        onRelationshipsChange={onRelationshipsChange}
      />
    </div>
  )
}
