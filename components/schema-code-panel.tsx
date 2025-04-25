"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

interface SchemaCodePanelProps {
  tables: TableData[]
  relationships: Relationship[]
}

export function SchemaCodePanel({ tables, relationships }: SchemaCodePanelProps) {
  const [activeTab, setActiveTab] = useState("prisma")

  // Generate Prisma schema
  const generatePrismaSchema = () => {
    if (!tables || tables.length === 0) {
      return `// This is your Prisma schema file

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

    let schema = `// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`

    // Process relationships to add them to the correct tables
    const tableRelationships = new Map()

    relationships.forEach((rel) => {
      // Get source and target tables
      const sourceTable = tables.find((t) => t.id === rel.source)
      const targetTable = tables.find((t) => t.id === rel.target)

      if (!sourceTable || !targetTable) return

      // Initialize relationship arrays if they don't exist
      if (!tableRelationships.has(sourceTable.id)) {
        tableRelationships.set(sourceTable.id, [])
      }
      if (!tableRelationships.has(targetTable.id)) {
        tableRelationships.set(targetTable.id, [])
      }

      // Determine relationship type
      const relType = rel.type || "one-to-many" // Default to one-to-many if not specified

      // Add relationship to source table
      tableRelationships.get(sourceTable.id).push({
        table: targetTable.name,
        field: targetTable.name.toLowerCase() + (relType === "one-to-many" ? "s" : ""),
        type: relType === "one-to-many" ? "many" : "one",
        foreignKey: rel.sourceKey,
        references: rel.targetKey,
      })

      // Add relationship to target table
      tableRelationships.get(targetTable.id).push({
        table: sourceTable.name,
        field: sourceTable.name.toLowerCase(),
        type: relType === "one-to-many" ? "one" : "many",
        foreignKey: rel.targetKey,
        references: rel.sourceKey,
      })
    })

    // Add models
    tables.forEach((table) => {
      schema += `model ${table.name} {\n`

      // Add columns
      table.columns.forEach((column) => {
        let columnDef = `  ${column.name} ${mapToPrismaType(column.type)}`

        // Add attributes
        const attributes = []
        if (column.isPrimary) attributes.push("@id")
        if (column.isUnique) attributes.push("@unique")

        if (attributes.length > 0) {
          columnDef += ` ${attributes.join(" ")}`
        }

        schema += `${columnDef}\n`
      })

      // Add relationships
      const tableRels = tableRelationships.get(table.id) || []

      if (tableRels.length > 0) {
        schema += "\n  // Relationships\n"

        tableRels.forEach((rel) => {
          if (rel.type === "many") {
            schema += `  ${rel.field} ${rel.table}[] @relation("${table.name}To${rel.table}")\n`
          } else {
            schema += `  ${rel.field} ${rel.table}? @relation("${rel.table}To${table.name}")\n`
          }
        })
      }

      schema += "}\n\n"
    })

    return schema
  }

  // Generate SQL schema
  const generateSQLSchema = () => {
    if (!tables || tables.length === 0) {
      return `-- SQL Schema

-- Add tables to your diagram to generate SQL schema
`
    }

    let schema = `-- SQL Schema\n\n`

    // Add tables
    tables.forEach((table) => {
      schema += `CREATE TABLE ${table.name.toLowerCase()} (\n`

      // Add columns
      const columnDefs = table.columns.map((column) => {
        let columnDef = `  ${column.name} ${mapToSQLType(column.type)}`

        // Add constraints
        if (column.isPrimary) columnDef += " PRIMARY KEY"
        if (column.isUnique) columnDef += " UNIQUE"

        return columnDef
      })

      schema += columnDefs.join(",\n")

      // Add foreign keys for relationships
      const tableRelationships = relationships.filter((rel) => rel.target === table.id || rel.source === table.id)

      if (tableRelationships.length > 0) {
        schema += ",\n\n  -- Foreign Keys\n"

        tableRelationships.forEach((rel) => {
          // If this table is the target of the relationship, add a foreign key
          if (rel.target === table.id) {
            const sourceTable = tables.find((t) => t.id === rel.source)
            if (sourceTable) {
              schema += `  FOREIGN KEY (${rel.targetKey}) REFERENCES ${sourceTable.name.toLowerCase()}(${rel.sourceKey}),\n`
            }
          }
          // If this table is the source and it's a many-to-many relationship with a through table
          else if (rel.source === table.id && rel.through) {
            const targetTable = tables.find((t) => t.id === rel.target)
            if (targetTable) {
              // We'll handle the through table separately
            }
          }
        })

        // Remove trailing comma and newline
        schema = schema.slice(0, -2)
      }

      schema += "\n);\n\n"
    })

    // Add junction tables for many-to-many relationships
    const manyToManyRels = relationships.filter((rel) => rel.through)

    if (manyToManyRels.length > 0) {
      schema += "-- Junction tables for many-to-many relationships\n\n"

      manyToManyRels.forEach((rel) => {
        const sourceTable = tables.find((t) => t.id === rel.source)
        const targetTable = tables.find((t) => t.id === rel.target)

        if (sourceTable && targetTable) {
          schema += `CREATE TABLE ${rel.through} (\n`
          schema += `  ${sourceTable.name.toLowerCase()}_${rel.sourceKey} ${mapToSQLType("uuid")} NOT NULL,\n`
          schema += `  ${targetTable.name.toLowerCase()}_${rel.targetKey} ${mapToSQLType("uuid")} NOT NULL,\n`
          schema += `  PRIMARY KEY (${sourceTable.name.toLowerCase()}_${rel.sourceKey}, ${targetTable.name.toLowerCase()}_${rel.targetKey}),\n`
          schema += `  FOREIGN KEY (${sourceTable.name.toLowerCase()}_${rel.sourceKey}) REFERENCES ${sourceTable.name.toLowerCase()}(${rel.sourceKey}),\n`
          schema += `  FOREIGN KEY (${targetTable.name.toLowerCase()}_${rel.targetKey}) REFERENCES ${targetTable.name.toLowerCase()}(${rel.targetKey})\n`
          schema += `);\n\n`
        }
      })
    }

    return schema
  }

  // Generate TypeScript types
  const generateTypeScriptTypes = () => {
    if (!tables || tables.length === 0) {
      return `// TypeScript Types

// Add tables to your diagram to generate TypeScript types
`
    }

    let types = `// TypeScript Types\n\n`

    // Process relationships to add them to the correct tables
    const tableRelationships = new Map()

    relationships.forEach((rel) => {
      // Get source and target tables
      const sourceTable = tables.find((t) => t.id === rel.source)
      const targetTable = tables.find((t) => t.id === rel.target)

      if (!sourceTable || !targetTable) return

      // Initialize relationship arrays if they don't exist
      if (!tableRelationships.has(sourceTable.id)) {
        tableRelationships.set(sourceTable.id, [])
      }
      if (!tableRelationships.has(targetTable.id)) {
        tableRelationships.set(targetTable.id, [])
      }

      // Determine relationship type
      const relType = rel.type || "one-to-many" // Default to one-to-many if not specified

      // Add relationship to source table
      tableRelationships.get(sourceTable.id).push({
        table: targetTable.name,
        field: targetTable.name.toLowerCase() + (relType === "one-to-many" ? "s" : ""),
        type: relType === "one-to-many" ? "many" : "one",
      })

      // Add relationship to target table
      tableRelationships.get(targetTable.id).push({
        table: sourceTable.name,
        field: sourceTable.name.toLowerCase(),
        type: relType === "one-to-many" ? "one" : "many",
      })
    })

    tables.forEach((table) => {
      types += `interface ${table.name} {\n`

      // Add properties
      table.columns.forEach((column) => {
        types += `  ${column.name}: ${mapToTypeScriptType(column.type)};\n`
      })

      // Add relationships
      const tableRels = tableRelationships.get(table.id) || []

      if (tableRels.length > 0) {
        types += "\n  // Relationships\n"

        tableRels.forEach((rel) => {
          if (rel.type === "many") {
            types += `  ${rel.field}: ${rel.table}[];\n`
          } else {
            types += `  ${rel.field}?: ${rel.table};\n`
          }
        })
      }

      types += `}\n\n`
    })

    return types
  }

  // Helper functions to map types
  const mapToPrismaType = (type: string) => {
    const typeMap: Record<string, string> = {
      string: "String",
      number: "Int",
      boolean: "Boolean",
      date: "DateTime",
      text: "String",
      integer: "Int",
      float: "Float",
      decimal: "Decimal",
      datetime: "DateTime",
      timestamp: "DateTime",
      json: "Json",
      uuid: "String",
      varchar: "String",
    }

    return typeMap[type.toLowerCase()] || "String"
  }

  const mapToSQLType = (type: string) => {
    const typeMap: Record<string, string> = {
      string: "VARCHAR(255)",
      number: "INTEGER",
      boolean: "BOOLEAN",
      date: "DATE",
      text: "TEXT",
      integer: "INTEGER",
      float: "FLOAT",
      decimal: "DECIMAL(10,2)",
      datetime: "TIMESTAMP",
      timestamp: "TIMESTAMP",
      json: "JSONB",
      uuid: "UUID",
      varchar: "VARCHAR(255)",
    }

    return typeMap[type.toLowerCase()] || "VARCHAR(255)"
  }

  const mapToTypeScriptType = (type: string) => {
    const typeMap: Record<string, string> = {
      string: "string",
      number: "number",
      boolean: "boolean",
      date: "Date",
      text: "string",
      integer: "number",
      float: "number",
      decimal: "number",
      datetime: "Date",
      timestamp: "Date",
      json: "Record<string, any>",
      uuid: "string",
      varchar: "string",
    }

    return typeMap[type.toLowerCase()] || "string"
  }

  // Get code based on active tab
  const getCode = () => {
    switch (activeTab) {
      case "prisma":
        return generatePrismaSchema()
      case "sql":
        return generateSQLSchema()
      case "typescript":
        return generateTypeScriptTypes()
      default:
        return generatePrismaSchema()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="border-b border-white/10 px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="prisma"
              className="data-[state=active]:bg-cryptic-accent data-[state=active]:text-black"
            >
              Prisma
            </TabsTrigger>
            <TabsTrigger value="sql" className="data-[state=active]:bg-cryptic-accent data-[state=active]:text-black">
              SQL
            </TabsTrigger>
            <TabsTrigger
              value="typescript"
              className="data-[state=active]:bg-cryptic-accent data-[state=active]:text-black"
            >
              TypeScript
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="prisma" className="h-full m-0">
            <pre className="h-full overflow-auto bg-cryptic-card p-4 rounded-md">
              <code>{generatePrismaSchema()}</code>
            </pre>
          </TabsContent>
          <TabsContent value="sql" className="h-full m-0">
            <pre className="h-full overflow-auto bg-cryptic-card p-4 rounded-md">
              <code>{generateSQLSchema()}</code>
            </pre>
          </TabsContent>
          <TabsContent value="typescript" className="h-full m-0">
            <pre className="h-full overflow-auto bg-cryptic-card p-4 rounded-md">
              <code>{generateTypeScriptTypes()}</code>
            </pre>
          </TabsContent>
        </div>
      </Tabs>

      <div className="border-t border-white/10 p-4 flex justify-end">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(getCode())
          }}
          className="bg-cryptic-accent text-black hover:bg-cryptic-accent/90"
        >
          Copy Code
        </Button>
      </div>
    </div>
  )
}
