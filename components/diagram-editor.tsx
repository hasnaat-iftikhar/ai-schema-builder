"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Plus, Table } from "lucide-react"
import { useRef, useState, useEffect } from "react"

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

interface Project {
  id: string
  name: string
  description: string
  tables: TableData[]
  relationships: Relationship[]
}

interface DiagramEditorProps {
  project: Project
}

export function DiagramEditor({ project }: DiagramEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [tables, setTables] = useState<TableData[]>(project.tables)
  const [relationships, setRelationships] = useState<Relationship[]>(project.relationships)

  // Mock function to handle table dragging
  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (!table) return

    setSelectedTable(tableId)
    setDragging(true)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Mock function to handle table position updates
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !selectedTable || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragOffset.x
    const newY = e.clientY - canvasRect.top - dragOffset.y

    setTables((prev) =>
      prev.map((table) =>
        table.id === selectedTable ? { ...table, x: Math.max(0, newX), y: Math.max(0, newY) } : table,
      ),
    )
  }

  // Mock function to handle mouse up
  const handleMouseUp = () => {
    setDragging(false)
  }

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging])

  // Mock function to add a new table
  const addTable = () => {
    const newId = `t${tables.length + 1}`
    const newTable: TableData = {
      id: newId,
      name: `New Table ${tables.length + 1}`,
      x: 100,
      y: 100,
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "created_at", type: "timestamp" },
      ],
    }
    setTables([...tables, newTable])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
      <div className="md:col-span-3 relative border rounded-lg overflow-hidden bg-muted/20">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button size="sm" onClick={addTable} className="gap-1">
            <Plus className="h-4 w-4" /> Add Table
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <Table className="h-4 w-4" /> Data Types <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>String</DropdownMenuItem>
              <DropdownMenuItem>Integer</DropdownMenuItem>
              <DropdownMenuItem>Boolean</DropdownMenuItem>
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>UUID</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          ref={canvasRef}
          className="w-full h-full overflow-auto p-4"
          style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 0)", backgroundSize: "20px 20px" }}
        >
          {tables.map((table) => (
            <div
              key={table.id}
              className={`absolute bg-card border rounded-md shadow-sm cursor-move ${
                selectedTable === table.id ? "ring-2 ring-primary" : ""
              }`}
              style={{ left: `${table.x}px`, top: `${table.y}px`, width: "200px" }}
              onMouseDown={(e) => handleMouseDown(e, table.id)}
            >
              <div className="p-2 border-b bg-muted/50 font-medium text-center">{table.name}</div>
              <div className="p-2 space-y-1 text-sm">
                {table.columns.map((column, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      {column.isPrimary && <span className="text-yellow-500 text-xs">🔑</span>}
                      {column.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{column.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Render relationships as SVG lines - simplified for the MVP */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {relationships.map((rel) => {
              const sourceTable = tables.find((t) => t.id === rel.source)
              const targetTable = tables.find((t) => t.id === rel.target)

              if (!sourceTable || !targetTable) return null

              // Simple straight line for MVP
              const x1 = sourceTable.x + 100 // Center of table
              const y1 = sourceTable.y + 30
              const x2 = targetTable.x + 100
              const y2 = targetTable.y + 30

              return (
                <line
                  key={rel.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              )
            })}
          </svg>
        </div>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Properties</CardTitle>
            <CardDescription>Edit the selected table or column</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {selectedTable ? (
              <Tabs defaultValue="table">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="columns">Columns</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="table-name">Table Name</Label>
                    <Input
                      id="table-name"
                      value={tables.find((t) => t.id === selectedTable)?.name || ""}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Update Table</Button>
                  </div>
                </TabsContent>
                <TabsContent value="columns" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Columns</Label>
                      <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Plus className="h-3 w-3" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {tables
                        .find((t) => t.id === selectedTable)
                        ?.columns.map((column, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 border rounded-md">
                            <div>
                              <span className="font-medium">{column.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{column.type}</span>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Table className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Select a table to edit its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
