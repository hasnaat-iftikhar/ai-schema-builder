"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Code } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface SchemaCodePanelProps {
  tables: TableData[]
  relationships: Relationship[]
  onTablesChange?: (tables: TableData[]) => void
  onRelationshipsChange?: (relationships: Relationship[]) => void
}

export function SchemaCodePanel({
  tables = [],
  relationships = [],
  onTablesChange,
  onRelationshipsChange,
}: SchemaCodePanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("prisma")
  const [copied, setCopied] = useState(false)
  const [code, setCode] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)

  const formats = [
    { id: "prisma", name: "Prisma" },
    { id: "sql", name: "SQL" },
    { id: "sequelize", name: "Sequelize" },
    { id: "typeorm", name: "TypeORM" },
  ]

  // Generate code based on the selected format and tables/relationships
  useEffect(() => {
    try {
      let generatedCode = ""

      switch (selectedFormat) {
        case "prisma":
          generatedCode = generatePrismaCode(tables, relationships)
          break
        case "sql":
          generatedCode = generateSQLCode(tables, relationships)
          break
        case "sequelize":
          generatedCode = generateSequelizeCode(tables, relationships)
          break
        case "typeorm":
          generatedCode = generateTypeORMCode(tables, relationships)
          break
        default:
          generatedCode = generatePrismaCode(tables, relationships)
      }

      setCode(generatedCode)
    } catch (error) {
      console.error("Error generating code:", error)
      setCode(`// Error generating code. Please try again.`)
    }
  }, [selectedFormat, tables, relationships])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-lg font-medium">Schema Code</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {formats.find((f) => f.id === selectedFormat)?.name || "Select Format"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {formats.map((format) => (
                <DropdownMenuItem key={format.id} onClick={() => setSelectedFormat(format.id)}>
                  {format.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="ghost" onClick={handleCopy} className="hover:bg-white/10">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
            <Code className="h-4 w-4 mr-2" /> {isEditing ? "Apply Changes" : "Edit Code"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-0 bg-cryptic-block w-full">
        <textarea
          className="w-full h-full p-4 bg-transparent text-sm font-mono resize-none focus:outline-none"
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
          readOnly={!isEditing}
        />
      </div>
    </div>
  )
}

// Helper function to generate Prisma code
function generatePrismaCode(tables: TableData[], relationships: Relationship[]) {
  if (!tables || tables.length === 0) {
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
    if (!table || !table.columns) return

    code += `model ${table.name} {
${table.columns
  .map((col) => {
    if (!col) return ""

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

    return `  ${col.name} ${type}`
  })
  .filter(Boolean)
  .join("\n")}
}

`
  })

  return code
}

// Helper function to generate SQL code
function generateSQLCode(tables: TableData[], relationships: Relationship[]) {
  if (!tables || tables.length === 0) {
    return `-- SQL Schema

-- Add tables to your diagram to generate SQL schema
`
  }

  let code = `-- SQL Schema

`

  // Create tables
  tables.forEach((table) => {
    if (!table || !table.columns) return

    code += `CREATE TABLE ${table.name.toLowerCase()} (
${table.columns
  .map((col) => {
    if (!col) return ""

    const type =
      col.type === "uuid"
        ? "UUID"
        : col.type === "varchar"
          ? "VARCHAR(255)"
          : col.type === "text"
            ? "TEXT"
            : col.type === "integer"
              ? "INTEGER"
              : col.type === "timestamp"
                ? "TIMESTAMP"
                : "VARCHAR(255)"

    const constraints = []
    if (col.isPrimary) {
      constraints.push("PRIMARY KEY")
    }
    if (col.isUnique) {
      constraints.push("UNIQUE")
    }

    return `  ${col.name} ${type}${constraints.length > 0 ? " " + constraints.join(" ") : ""}`
  })
  .filter(Boolean)
  .join(",\n")}
);

`
  })

  return code
}

// Helper function to generate Sequelize code
function generateSequelizeCode(tables: TableData[], relationships: Relationship[]) {
  if (!tables || tables.length === 0) {
    return `// Sequelize Models

// Add tables to your diagram to generate Sequelize models
`
  }

  let code = `// Sequelize Models

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

`

  // Define models
  tables.forEach((table) => {
    if (!table || !table.columns) return

    code += `const ${table.name} = sequelize.define('${table.name.toLowerCase()}', {
${table.columns
  .map((col) => {
    if (!col) return ""

    const type =
      col.type === "uuid"
        ? "DataTypes.UUID"
        : col.type === "varchar"
          ? "DataTypes.STRING"
          : col.type === "text"
            ? "DataTypes.TEXT"
            : col.type === "integer"
              ? "DataTypes.INTEGER"
              : col.type === "timestamp"
                ? "DataTypes.DATE"
                : col.type === "boolean"
                  ? "DataTypes.BOOLEAN"
                  : "DataTypes.STRING"

    const options = []
    if (col.isPrimary) {
      options.push("primaryKey: true")
    }
    if (col.isUnique) {
      options.push("unique: true")
    }

    return `  ${col.name}: {
    type: ${type}${options.length > 0 ? ",\n    " + options.join(",\n    ") : ""}
  }`
  })
  .filter(Boolean)
  .join(",\n")}
});

`
  })

  return code
}

// Helper function to generate TypeORM code
function generateTypeORMCode(tables: TableData[], relationships: Relationship[]) {
  if (!tables || tables.length === 0) {
    return `// TypeORM Entities

// Add tables to your diagram to generate TypeORM entities
`
  }

  let code = `// TypeORM Entities

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

`

  // Define entities
  tables.forEach((table) => {
    if (!table || !table.columns) return

    code += `@Entity()
export class ${table.name} {
${table.columns
  .map((col) => {
    if (!col) return ""

    if (col.isPrimary) {
      if (col.type === "uuid") {
        return `  @PrimaryGeneratedColumn("uuid")
  ${col.name}: string;`
      } else if (col.type === "integer") {
        return `  @PrimaryGeneratedColumn()
  ${col.name}: number;`
      } else {
        return `  @PrimaryGeneratedColumn()
  ${col.name}: string;`
      }
    } else {
      let decorator = `  @Column()`
      let type = "string"

      if (col.type === "integer") {
        type = "number"
      } else if (col.type === "boolean") {
        type = "boolean"
      } else if (col.type === "timestamp") {
        type = "Date"
      }

      if (col.isUnique) {
        decorator = `  @Column({ unique: true })`
      }

      return `${decorator}
  ${col.name}: ${type};`
    }
  })
  .filter(Boolean)
  .join("\n\n")}
}

`
  })

  return code
}
