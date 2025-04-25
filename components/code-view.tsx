"use client"
import { SchemaCodePanel } from "@/components/schema-code-panel"

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
}

export function CodeView({ tables, relationships }: CodeViewProps) {
  return (
    <div className="h-full">
      <SchemaCodePanel tables={tables} relationships={relationships} />
    </div>
  )
}
