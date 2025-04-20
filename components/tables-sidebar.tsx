"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Trash2, Search } from "lucide-react"

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

interface TablesSidebarProps {
  tables: TableData[]
  onTableSelect: (tableId: string) => void
  onTableDelete: (tableId: string) => void
}

export function TablesSidebar({ tables, onTableSelect, onTableDelete }: TablesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTables = useMemo(() => {
    if (!searchQuery.trim()) return tables

    return tables.filter((table) => table.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [tables, searchQuery])

  return (
    <div className="w-[320px] border-l border-white/10 bg-cryptic-background flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-cryptic-block border-white/10"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-2 space-y-1">
          {filteredTables.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 text-center">No tables found</div>
          ) : (
            filteredTables.map((table) => (
              <div
                key={table.id}
                className="group flex items-center justify-between p-2 rounded-md hover:bg-cryptic-block cursor-pointer"
                onClick={() => onTableSelect(table.id)}
              >
                <span className="text-sm truncate">{table.name}</span>
                <button
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTableDelete(table.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
