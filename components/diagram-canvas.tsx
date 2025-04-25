"use client"

import { useRef, useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Link } from "lucide-react"

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

interface DiagramCanvasProps {
  tables: TableData[]
  relationships: Relationship[]
  onEditTable: (tableId: string) => void
  onDeleteTable: (tableId: string) => void
  onAddRelationship: (relationship: Relationship) => void
  onDeleteRelationship: (relationshipId: string) => void
}

export function DiagramCanvas({
  tables,
  relationships,
  onEditTable,
  onDeleteTable,
  onAddRelationship,
  onDeleteRelationship,
}: DiagramCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [creatingRelationship, setCreatingRelationship] = useState(false)
  const [relationshipStart, setRelationshipStart] = useState<{
    tableId: string
    columnName: string
  } | null>(null)

  // Handle table dragging
  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    e.stopPropagation()
    setSelectedTable(tableId)
    setDragging(true)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Handle table position updates
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !selectedTable || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragOffset.x
    const newY = e.clientY - canvasRect.top - dragOffset.y

    const updatedTables = tables.map((table) =>
      table.id === selectedTable ? { ...table, x: Math.max(0, newX), y: Math.max(0, newY) } : table,
    )

    // This would typically call onTablesChange, but we'll just update the local state for now
    // to avoid excessive re-renders during dragging
  }

  // Handle mouse up
  const handleMouseUp = () => {
    if (dragging && selectedTable) {
      // Now we can call onTablesChange with the final position
      const table = tables.find((t) => t.id === selectedTable)
      if (table) {
        const canvasRect = canvasRef.current?.getBoundingClientRect()
        if (canvasRect) {
          const updatedTables = tables.map((t) =>
            t.id === selectedTable
              ? {
                  ...t,
                  x: Math.max(0, t.x),
                  y: Math.max(0, t.y),
                }
              : t,
          )
          // onTablesChange(updatedTables)
        }
      }
    }
    setDragging(false)
  }

  // Start creating a relationship
  const handleStartRelationship = (tableId: string, columnName: string) => {
    setCreatingRelationship(true)
    setRelationshipStart({ tableId, columnName })
  }

  // Complete relationship creation
  const handleCompleteRelationship = (targetTableId: string, targetColumnName: string) => {
    if (!relationshipStart || relationshipStart.tableId === targetTableId) {
      setCreatingRelationship(false)
      setRelationshipStart(null)
      return
    }

    // Create the relationship
    const newRelationship: Relationship = {
      id: `rel-${Date.now()}`,
      source: relationshipStart.tableId,
      target: targetTableId,
      sourceKey: relationshipStart.columnName,
      targetKey: targetColumnName,
      type: "one-to-many", // Default type
    }

    onAddRelationship(newRelationship)
    setCreatingRelationship(false)
    setRelationshipStart(null)
  }

  // Cancel relationship creation
  const handleCancelRelationship = () => {
    setCreatingRelationship(false)
    setRelationshipStart(null)
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

  // Handle canvas click to deselect
  const handleCanvasClick = () => {
    setSelectedTable(null)
    if (creatingRelationship) {
      handleCancelRelationship()
    }
  }

  return (
    <div
      ref={canvasRef}
      className="w-full h-full overflow-auto p-4"
      style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 0)", backgroundSize: "20px 20px" }}
      onClick={handleCanvasClick}
    >
      {/* Render tables */}
      {tables.map((table) => (
        <div
          key={table.id}
          className={`absolute bg-card border rounded-md shadow-sm cursor-move ${
            selectedTable === table.id ? "ring-2 ring-primary" : ""
          }`}
          style={{ left: `${table.x}px`, top: `${table.y}px`, width: "220px" }}
          onMouseDown={(e) => handleMouseDown(e, table.id)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2 border-b bg-muted/50 font-medium text-center flex justify-between items-center">
            <span>{table.name}</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditTable(table.id)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTable(table.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="p-2 space-y-1 text-sm">
            {table.columns.map((column, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-1 hover:bg-muted/30 rounded-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex items-center gap-1">
                  {column.isPrimary && <span className="text-yellow-500 text-xs">🔑</span>}
                  {column.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{column.type}</span>
                  {creatingRelationship ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCompleteRelationship(table.id, column.name)
                      }}
                    >
                      <Link className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartRelationship(table.id, column.name)
                      }}
                    >
                      <Link className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Render relationships as SVG lines */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {relationships.map((rel) => {
          const sourceTable = tables.find((t) => t.id === rel.source)
          const targetTable = tables.find((t) => t.id === rel.target)

          if (!sourceTable || !targetTable) return null

          // Calculate connection points
          const sourceX = sourceTable.x + 220 // Right side of source table
          const sourceY = sourceTable.y + 30 + sourceTable.columns.findIndex((c) => c.name === rel.sourceKey) * 24
          const targetX = targetTable.x // Left side of target table
          const targetY = targetTable.y + 30 + targetTable.columns.findIndex((c) => c.name === rel.targetKey) * 24

          // Draw a path with a curve
          const midX = (sourceX + targetX) / 2
          const path = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`

          return (
            <g key={rel.id}>
              <path
                d={path}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray={rel.type === "many-to-many" ? "4" : "none"}
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              {/* Source end marker (circle for "one", crow's foot for "many") */}
              {rel.type === "one-to-many" || rel.type === "one-to-one" ? (
                <circle cx={sourceX} cy={sourceY} r="3" fill="currentColor" />
              ) : (
                <path
                  d={`M ${sourceX - 6} ${sourceY - 6} L ${sourceX} ${sourceY} L ${sourceX - 6} ${sourceY + 6}`}
                  stroke="currentColor"
                  fill="none"
                />
              )}
              {/* Target end marker (circle for "one", crow's foot for "many") */}
              {rel.type === "one-to-one" || rel.type === "many-to-one" ? (
                <circle cx={targetX} cy={targetY} r="3" fill="currentColor" />
              ) : (
                <path
                  d={`M ${targetX + 6} ${targetY - 6} L ${targetX} ${targetY} L ${targetX + 6} ${targetY + 6}`}
                  stroke="currentColor"
                  fill="none"
                />
              )}
              {/* Delete button for relationship */}
              <foreignObject
                x={(sourceX + targetX) / 2 - 8}
                y={(sourceY + targetY) / 2 - 8}
                width="16"
                height="16"
                className="pointer-events-auto"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 bg-background/80 rounded-full hover:bg-red-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteRelationship(rel.id)
                  }}
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </foreignObject>
            </g>
          )
        })}
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
      </svg>

      {/* Relationship creation line */}
      {creatingRelationship && relationshipStart && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <line
            x1={
              tables.find((t) => t.id === relationshipStart.tableId)?.x + 220 // Right side of table
            }
            y1={
              (tables.find((t) => t.id === relationshipStart.tableId)?.y || 0) +
              30 +
              (tables
                .find((t) => t.id === relationshipStart.tableId)
                ?.columns.findIndex((c) => c.name === relationshipStart.columnName) || 0) *
                24
            }
            x2={window.innerWidth / 2}
            y2={window.innerHeight / 2}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4"
          />
        </svg>
      )}
    </div>
  )
}
