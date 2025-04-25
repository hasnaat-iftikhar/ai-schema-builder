"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface TablePropertiesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: TableData | null
  onTableUpdate: (table: TableData) => void
  tables?: TableData[]
  relationships?: Relationship[]
  onRelationshipsChange?: (relationships: Relationship[]) => void
}

export function TablePropertiesDialog({
  open,
  onOpenChange,
  table,
  onTableUpdate,
  tables = [],
  relationships = [],
  onRelationshipsChange,
}: TablePropertiesDialogProps) {
  const [activeTab, setActiveTab] = useState("table")
  const [tableName, setTableName] = useState(table?.name || "")
  const [columns, setColumns] = useState<Column[]>(table?.columns || [])
  const [tableRelationships, setTableRelationships] = useState<Relationship[]>([])
  const [newRelationship, setNewRelationship] = useState<{
    targetTable: string
    sourceColumn: string
    targetColumn: string
    type: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many"
  }>({
    targetTable: "",
    sourceColumn: "",
    targetColumn: "",
    type: "one-to-many",
  })

  // Data types for dropdown
  const dataTypes = [
    { value: "varchar", label: "VARCHAR" },
    { value: "integer", label: "INTEGER" },
    { value: "text", label: "TEXT" },
    { value: "boolean", label: "BOOLEAN" },
    { value: "uuid", label: "UUID" },
    { value: "timestamp", label: "TIMESTAMP" },
    { value: "decimal", label: "DECIMAL" },
    { value: "date", label: "DATE" },
    { value: "json", label: "JSON" },
  ]

  // Update local state when table changes
  useEffect(() => {
    if (table) {
      setTableName(table.name)
      setColumns([...table.columns])

      // Filter relationships related to this table
      if (relationships && table) {
        const tableRels = relationships.filter((rel) => rel.source === table.id || rel.target === table.id)
        setTableRelationships(tableRels)
      }
    }
  }, [table, relationships])

  const handleUpdateTable = () => {
    if (!table) return

    const updatedTable = {
      ...table,
      name: tableName,
      columns: columns,
    }

    onTableUpdate(updatedTable)
    onOpenChange(false)
  }

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        name: "",
        type: "varchar",
        isPrimary: false,
        isUnique: false,
      },
    ])
  }

  const updateColumn = (index: number, field: keyof Column, value: any) => {
    const newColumns = [...columns]
    newColumns[index] = { ...newColumns[index], [field]: value }
    setColumns(newColumns)
  }

  const removeColumn = (index: number) => {
    const newColumns = [...columns]
    newColumns.splice(index, 1)
    setColumns(newColumns)
  }

  const addRelationship = () => {
    if (!table || !onRelationshipsChange) return
    if (!newRelationship.targetTable || !newRelationship.sourceColumn || !newRelationship.targetColumn) return

    const newRel: Relationship = {
      id: `r${relationships.length + 1}`,
      source: table.id,
      target: newRelationship.targetTable,
      sourceKey: newRelationship.sourceColumn,
      targetKey: newRelationship.targetColumn,
      type: newRelationship.type,
      through:
        newRelationship.type === "many-to-many"
          ? `${table.name}_${getTableNameById(newRelationship.targetTable)}`
          : undefined,
    }

    const updatedRelationships = [...relationships, newRel]
    onRelationshipsChange(updatedRelationships)
    setTableRelationships([...tableRelationships, newRel])

    // Reset form
    setNewRelationship({
      targetTable: "",
      sourceColumn: "",
      targetColumn: "",
      type: "one-to-many",
    })
  }

  const removeRelationship = (relationshipId: string) => {
    if (!onRelationshipsChange) return

    const updatedRelationships = relationships.filter((rel) => rel.id !== relationshipId)
    onRelationshipsChange(updatedRelationships)
    setTableRelationships(tableRelationships.filter((rel) => rel.id !== relationshipId))
  }

  const getTableNameById = (id: string) => {
    const foundTable = tables.find((t) => t.id === id)
    return foundTable ? foundTable.name : id
  }

  // Get relationship type display text
  const getRelationshipTypeDisplay = (type: string) => {
    switch (type) {
      case "one-to-one":
        return "One-to-One"
      case "one-to-many":
        return "One-to-Many"
      case "many-to-one":
        return "Many-to-One"
      case "many-to-many":
        return "Many-to-Many"
      default:
        return "One-to-Many"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] bg-cryptic-card border-white/10">
        <DialogHeader>
          <DialogTitle>{table ? `Edit Table: ${table.name}` : "Add Table"}</DialogTitle>
          <DialogDescription>
            {table ? "Update the properties of this table." : "Add a new table to your schema."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="columns">Columns</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="table-name">Table Name</Label>
              <Input
                id="table-name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="bg-cryptic-background border-white/10"
              />
            </div>
          </TabsContent>

          <TabsContent value="columns" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Columns</Label>
                <Button size="sm" variant="outline" className="h-8 gap-1" onClick={addColumn}>
                  <Plus className="h-3 w-3" /> Add Column
                </Button>
              </div>

              {/* Column Headers */}
              <div className="grid grid-cols-12 gap-2 px-2 py-1 font-medium text-sm">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Type</div>
                <div className="col-span-2 text-center">Primary</div>
                <div className="col-span-2 text-center">Unique</div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {columns.map((column, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center p-2 border border-white/10 rounded-md bg-cryptic-background"
                  >
                    {/* Column Name */}
                    <div className="col-span-4">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumn(idx, "name", e.target.value)}
                        className="bg-cryptic-block border-white/10"
                        placeholder="Column name"
                      />
                    </div>

                    {/* Data Type */}
                    <div className="col-span-3">
                      <Select value={column.type} onValueChange={(value) => updateColumn(idx, "type", value)}>
                        <SelectTrigger className="bg-cryptic-block border-white/10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Primary Key Checkbox */}
                    <div className="col-span-2 flex justify-center">
                      <Checkbox
                        checked={column.isPrimary}
                        onCheckedChange={(checked) => updateColumn(idx, "isPrimary", checked)}
                      />
                    </div>

                    {/* Unique Key Checkbox */}
                    <div className="col-span-2 flex justify-center">
                      <Checkbox
                        checked={column.isUnique}
                        onCheckedChange={(checked) => updateColumn(idx, "isUnique", checked)}
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => removeColumn(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Relationships</Label>
                {tableRelationships.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-4 text-center border border-white/10 rounded-md">
                    No relationships defined
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tableRelationships.map((rel) => {
                      const isSource = rel.source === table?.id
                      const otherTableId = isSource ? rel.target : rel.source
                      const otherTableName = getTableNameById(otherTableId)
                      const relationshipType = rel.type || "one-to-many"

                      return (
                        <div key={rel.id} className="p-3 border border-white/10 rounded-md bg-cryptic-background">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{isSource ? tableName : otherTableName}</span>
                              <span className="mx-2">→</span>
                              <span className="font-medium">{isSource ? otherTableName : tableName}</span>
                              <span className="ml-2 text-xs bg-cryptic-accent/20 text-cryptic-accent px-2 py-0.5 rounded-full">
                                {getRelationshipTypeDisplay(relationshipType)}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => removeRelationship(rel.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {isSource ? tableName : otherTableName}.{isSource ? rel.sourceKey : rel.targetKey} →
                            {isSource ? otherTableName : tableName}.{isSource ? rel.targetKey : rel.sourceKey}
                            {rel.through && <span> (through {rel.through})</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {tables.length > 1 && (
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <Label>Add New Relationship</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-table">Target Table</Label>
                      <Select
                        value={newRelationship.targetTable}
                        onValueChange={(value) => setNewRelationship({ ...newRelationship, targetTable: value })}
                      >
                        <SelectTrigger className="bg-cryptic-block border-white/10">
                          <SelectValue placeholder="Select table" />
                        </SelectTrigger>
                        <SelectContent>
                          {tables
                            .filter((t) => t.id !== table?.id)
                            .map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relationship-type">Relationship Type</Label>
                      <Select
                        value={newRelationship.type}
                        onValueChange={(value: any) => setNewRelationship({ ...newRelationship, type: value })}
                      >
                        <SelectTrigger className="bg-cryptic-block border-white/10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-to-one">One-to-One</SelectItem>
                          <SelectItem value="one-to-many">One-to-Many</SelectItem>
                          <SelectItem value="many-to-one">Many-to-One</SelectItem>
                          <SelectItem value="many-to-many">Many-to-Many</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="source-column">Source Column</Label>
                      <Select
                        value={newRelationship.sourceColumn}
                        onValueChange={(value) => setNewRelationship({ ...newRelationship, sourceColumn: value })}
                      >
                        <SelectTrigger className="bg-cryptic-block border-white/10">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((col) => (
                            <SelectItem key={col.name} value={col.name}>
                              {col.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target-column">Target Column</Label>
                      <Select
                        value={newRelationship.targetColumn}
                        onValueChange={(value) => setNewRelationship({ ...newRelationship, targetColumn: value })}
                        disabled={!newRelationship.targetTable}
                      >
                        <SelectTrigger className="bg-cryptic-block border-white/10">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {tables
                            .find((t) => t.id === newRelationship.targetTable)
                            ?.columns.map((col) => (
                              <SelectItem key={col.name} value={col.name}>
                                {col.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={addRelationship}
                    disabled={
                      !newRelationship.targetTable || !newRelationship.sourceColumn || !newRelationship.targetColumn
                    }
                    className="mt-4 w-full bg-cryptic-accent text-black hover:bg-cryptic-accent/90 h-10 rounded-lg"
                    style={{ height: "40px", borderRadius: "8px", marginTop: "16px" }}
                  >
                    Add Relationship
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateTable} className="bg-cryptic-accent text-black hover:bg-cryptic-accent/90">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
