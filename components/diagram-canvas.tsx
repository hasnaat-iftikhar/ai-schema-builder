"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"

interface Column {
  name: string
  type: string
  isPrimary?: boolean
  isUnique?: boolean
  isForeign?: boolean
  foreignTable?: string
  foreignColumn?: string
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
  onTablesChange: (tables: TableData[]) => void
  onRelationshipsChange: (relationships: Relationship[]) => void
  onTableSelect?: (tableId: string) => void
}

export function DiagramCanvas({
  tables,
  relationships,
  onTablesChange,
  onRelationshipsChange,
  onTableSelect,
}: DiagramCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Function to handle table dragging
  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (!table) return

    setSelectedTable(tableId)
    if (onTableSelect) {
      onTableSelect(tableId)
    }
    setDragging(true)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Function to handle table position updates
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !selectedTable || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragOffset.x
    const newY = e.clientY - canvasRect.top - dragOffset.y

    onTablesChange(
      tables.map((table) =>
        table.id === selectedTable ? { ...table, x: Math.max(0, newX), y: Math.max(0, newY) } : table,
      ),
    )
  }

  // Function to handle mouse up
  const handleMouseUp = () => {
    setDragging(false)
  }

  // Add a new method to handle table selection
  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId)
    // Scroll to the table if needed
    const tableElement = document.getElementById(`table-${tableId}`)
    if (tableElement && canvasRef.current) {
      tableElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    if (onTableSelect) {
      onTableSelect(tableId)
    }
  }

  // Calculate connection points for relationship lines
  const getConnectionPoints = (
    sourceTable: TableData,
    targetTable: TableData,
    sourceKey: string,
    targetKey: string,
  ) => {
    // Find the position of the columns in their respective tables
    const sourceColumnIndex = sourceTable.columns.findIndex((col) => col.name === sourceKey)
    const targetColumnIndex = targetTable.columns.findIndex((col) => col.name === targetKey)

    // Calculate the y-offset based on column position (header height + column index * row height)
    const headerHeight = 30
    const rowHeight = 24
    const sourceY = sourceTable.y + headerHeight + (sourceColumnIndex + 0.5) * rowHeight
    const targetY = targetTable.y + headerHeight + (targetColumnIndex + 0.5) * rowHeight

    // Determine which side of the table to connect from
    const tableWidth = 200
    let sourceX, targetX, sourceSide, targetSide

    if (sourceTable.x + tableWidth < targetTable.x) {
      // Source is to the left of target
      sourceX = sourceTable.x + tableWidth
      targetX = targetTable.x
      sourceSide = "right"
      targetSide = "left"
    } else if (sourceTable.x > targetTable.x + tableWidth) {
      // Source is to the right of target
      sourceX = sourceTable.x
      targetX = targetTable.x + tableWidth
      sourceSide = "left"
      targetSide = "right"
    } else if (sourceTable.y + headerHeight > targetTable.y + headerHeight + targetTable.columns.length * rowHeight) {
      // Source is below target
      sourceX = sourceTable.x + tableWidth / 2
      targetX = targetTable.x + tableWidth / 2
      const sourceY = sourceTable.y
      const targetY = targetTable.y + headerHeight + targetTable.columns.length * rowHeight
      sourceSide = "top"
      targetSide = "bottom"
    } else {
      // Source is above target
      sourceX = sourceTable.x + tableWidth / 2
      targetX = targetTable.x + tableWidth / 2
      const sourceY = sourceTable.y + headerHeight + sourceTable.columns.length * rowHeight
      const targetY = targetTable.y
      sourceSide = "bottom"
      targetSide = "top"
    }

    return { sourceX, sourceY, targetX, targetY, sourceSide, targetSide }
  }

  // Generate a bezier curve path between two points
  const generateBezierPath = (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    sourceSide: string,
    targetSide: string,
  ) => {
    // Calculate control points for the bezier curve
    const dx = Math.abs(targetX - sourceX)
    const dy = Math.abs(targetY - sourceY)
    const curveFactor = Math.min(dx, dy, 100) * 0.8

    let sourceControlX, sourceControlY, targetControlX, targetControlY

    if (sourceSide === "right") {
      sourceControlX = sourceX + curveFactor
      sourceControlY = sourceY
    } else if (sourceSide === "left") {
      sourceControlX = sourceX - curveFactor
      sourceControlY = sourceY
    } else if (sourceSide === "bottom") {
      sourceControlX = sourceX
      sourceControlY = sourceY + curveFactor
    } else {
      // top
      sourceControlX = sourceX
      sourceControlY = sourceY - curveFactor
    }

    if (targetSide === "right") {
      targetControlX = targetX + curveFactor
      targetControlY = targetY
    } else if (targetSide === "left") {
      targetControlX = targetX - curveFactor
      targetControlY = targetY
    } else if (targetSide === "bottom") {
      targetControlX = targetX
      targetControlY = targetY + curveFactor
    } else {
      // top
      targetControlX = targetX
      targetControlY = targetY - curveFactor
    }

    return `M ${sourceX} ${sourceY} C ${sourceControlX} ${sourceControlY}, ${targetControlX} ${targetControlY}, ${targetX} ${targetY}`
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

  // Render relationship markers based on relationship type
  const renderRelationshipMarker = (type: string, side: string, x: number, y: number, angle: number) => {
    // Rotate the marker based on the angle
    const transform = `translate(${x}, ${y}) rotate(${angle})`

    if (side === "source") {
      if (type === "one-to-many" || type === "one-to-one") {
        // Render a "one" marker (vertical line)
        return (
          <g transform={transform}>
            <line x1="0" y1="-6" x2="0" y2="6" stroke="currentColor" strokeWidth="2" />
          </g>
        )
      } else if (type === "many-to-one" || type === "many-to-many") {
        // Render a "many" marker (crow's foot)
        return (
          <g transform={transform}>
            <line x1="0" y1="0" x2="-8" y2="-6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="-8" y2="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="-8" y1="-6" x2="-8" y2="6" stroke="currentColor" strokeWidth="1.5" />
          </g>
        )
      }
    } else {
      // target side
      if (type === "one-to-many" || type === "many-to-many") {
        // Render a "many" marker (crow's foot)
        return (
          <g transform={transform}>
            <line x1="0" y1="0" x2="-8" y2="-6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="-8" y2="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="-8" y1="-6" x2="-8" y2="6" stroke="currentColor" strokeWidth="1.5" />
          </g>
        )
      } else if (type === "one-to-one" || type === "many-to-one") {
        // Render a "one" marker (vertical line)
        return (
          <g transform={transform}>
            <line x1="0" y1="-6" x2="0" y2="6" stroke="currentColor" strokeWidth="2" />
          </g>
        )
      }
    }

    return null
  }

  // Calculate angle for marker rotation
  const calculateAngle = (x1: number, y1: number, x2: number, y2: number) => {
    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-cryptic-background flex flex-col">
      <div
        ref={canvasRef}
        className="flex-1 w-full overflow-auto p-4"
        style={{ backgroundImage: "radial-gradient(#2a2a2d 1px, transparent 0)", backgroundSize: "20px 20px" }}
      >
        {tables.map((table) => (
          <div
            key={table.id}
            id={`table-${table.id}`}
            className={`absolute bg-cryptic-card border border-white/10 rounded-md shadow-sm cursor-move ${
              selectedTable === table.id ? "ring-2 ring-cryptic-accent" : ""
            }`}
            style={{ left: `${table.x}px`, top: `${table.y}px`, width: "200px" }}
            onMouseDown={(e) => handleMouseDown(e, table.id)}
            onClick={() => handleTableSelect(table.id)}
          >
            <div className="p-2 border-b border-white/10 bg-cryptic-block/50 font-medium text-center">{table.name}</div>
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

        {/* Render relationships as SVG paths with markers */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            {/* Define markers for different relationship types */}
            <marker id="pk-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <circle cx="5" cy="5" r="4" fill="#C5FC70" stroke="currentColor" strokeWidth="1" />
            </marker>
            <marker id="fk-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <circle cx="5" cy="5" r="4" fill="#FF6B6B" stroke="currentColor" strokeWidth="1" />
            </marker>
          </defs>

          {relationships.map((rel) => {
            const sourceTable = tables.find((t) => t.id === rel.source)
            const targetTable = tables.find((t) => t.id === rel.target)

            if (!sourceTable || !targetTable) return null

            // Get connection points and sides
            const { sourceX, sourceY, targetX, targetY, sourceSide, targetSide } = getConnectionPoints(
              sourceTable,
              targetTable,
              rel.sourceKey,
              rel.targetKey,
            )

            // Generate bezier path
            const path = generateBezierPath(sourceX, sourceY, targetX, targetY, sourceSide, targetSide)

            // Calculate angles for markers
            const sourceAngle = calculateAngle(
              sourceX,
              sourceY,
              sourceSide === "right" ? sourceX + 20 : sourceSide === "left" ? sourceX - 20 : sourceX,
              sourceSide === "bottom" ? sourceY + 20 : sourceSide === "top" ? sourceY - 20 : sourceY,
            )

            const targetAngle = calculateAngle(
              targetX,
              targetY,
              targetSide === "right" ? targetX + 20 : targetSide === "left" ? targetX - 20 : targetX,
              targetSide === "bottom" ? targetY + 20 : targetSide === "top" ? targetY - 20 : targetY,
            )

            return (
              <g key={rel.id}>
                {/* Main relationship path */}
                <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

                {/* Relationship type markers */}
                {renderRelationshipMarker(rel.type || "one-to-many", "source", sourceX, sourceY, sourceAngle)}
                {renderRelationshipMarker(rel.type || "one-to-many", "target", targetX, targetY, targetAngle)}

                {/* PK/FK indicators */}
                <text
                  x={sourceX + (sourceSide === "left" ? -25 : sourceSide === "right" ? 25 : 0)}
                  y={sourceY + (sourceSide === "top" ? -15 : sourceSide === "bottom" ? 15 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold"
                  fill="#C5FC70"
                >
                  PK
                </text>
                <text
                  x={targetX + (targetSide === "left" ? -25 : targetSide === "right" ? 25 : 0)}
                  y={targetY + (targetSide === "top" ? -15 : targetSide === "bottom" ? 15 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold"
                  fill="#FF6B6B"
                >
                  FK
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
