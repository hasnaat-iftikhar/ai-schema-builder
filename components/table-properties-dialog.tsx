"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

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

interface TablePropertiesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: TableData | null
  tables: TableData[]
  onSave: (table: TableData) => void
}

export function TablePropertiesDialog({ open, onOpenChange, table, tables, onSave }: TablePropertiesDialogProps) {
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState<Column[]>([])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (table) {
        setTableName(table.name)
        setColumns([...table.columns])
      } else {
        setTableName("")
        setColumns([{ name: "id", type: "integer", isPrimary: true }])
      }
    }
  }, [open, table])

  // Add a new column
  const addColumn = () => {
    setColumns([...columns, { name: "", type: "string" }])
  }

  // Remove a column
  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  // Update a column property
  const updateColumn = (index: number, field: keyof Column, value: any) => {
    const updatedColumns = [...columns]
    updatedColumns[index] = { ...updatedColumns[index], [field]: value }
    setColumns(updatedColumns)
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!tableName.trim()) return

    const newTable: TableData = {
      id: table?.id || `table-${Date.now()}`,
      name: tableName,
      x: table?.x || 0,
      y: table?.y || 0,
      columns: columns.filter((col) => col.name.trim() !== ""),
    }

    onSave(newTable)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-cryptic-card border-white/10">
        <DialogHeader>
          <DialogTitle>{table ? "Edit Table" : "Create New Table"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
              className="bg-cryptic-background border-white/10"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label>Columns</Label>
              <Button type="button" variant="outline" size="sm" onClick={addColumn} className="gap-1 border-white/10">
                <Plus className="h-3 w-3" />
                Add Column
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {columns.map((column, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Input
                      value={column.name}
                      onChange={(e) => updateColumn(index, "name", e.target.value)}
                      placeholder="Column name"
                      className="bg-cryptic-background border-white/10"
                    />
                  </div>

                  <div className="col-span-3">
                    <Select value={column.type} onValueChange={(value) => updateColumn(index, "type", value)}>
                      <SelectTrigger className="bg-cryptic-background border-white/10">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-cryptic-card border-white/10">
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="integer">Integer</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="float">Float</SelectItem>
                        <SelectItem value="decimal">Decimal</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Checkbox
                        id={`primary-${index}`}
                        checked={column.isPrimary || false}
                        onCheckedChange={(checked) => updateColumn(index, "isPrimary", checked)}
                      />
                      <Label htmlFor={`primary-${index}`} className="text-xs">
                        Primary
                      </Label>
                    </div>

                    <div className="flex items-center gap-1">
                      <Checkbox
                        id={`unique-${index}`}
                        checked={column.isUnique || false}
                        onCheckedChange={(checked) => updateColumn(index, "isUnique", checked)}
                      />
                      <Label htmlFor={`unique-${index}`} className="text-xs">
                        Unique
                      </Label>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColumn(index)}
                      className="h-7 w-7 text-red-400"
                      disabled={columns.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!tableName.trim() || columns.length === 0}
            className="bg-cryptic-accent text-black hover:bg-cryptic-accent/90"
          >
            {table ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
