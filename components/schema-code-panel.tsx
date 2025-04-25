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
  type?: "one-to-one" | "one-to-many" | "many-to-many"
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

  // Process relationships to add them to the correct tables
  const tableRelationships = new Map<string, any[]>()

  tables.forEach((table) => {
    tableRelationships.set(table.id, [])
  })

  relationships.forEach((rel) => {
    const sourceTable = tables.find((t) => t.id === rel.source)
    const targetTable = tables.find((t) => t.id === rel.target)

    if (!sourceTable || !targetTable) return

    const relType = rel.type || "one-to-many"

    // For one-to-many relationships:
    // - Source table (the "one" side) has an array of target entities
    // - Target table (the "many" side) has a reference to the source entity and a foreign key
    if (relType === "one-to-many" || relType === "many-to-one") {
      // The "one" side (source in one-to-many, target in many-to-one)
      const oneSideTable = relType === "one-to-many" ? sourceTable : targetTable
      const oneSideTableId = relType === "one-to-many" ? rel.source : rel.target

      // The "many" side (target in one-to-many, source in many-to-one)
      const manySideTable = relType === "one-to-many" ? targetTable : sourceTable
      const manySideTableId = relType === "one-to-many" ? rel.target : rel.source

      // The key in the "one" side that is referenced
      const oneKey = relType === "one-to-many" ? rel.sourceKey : rel.targetKey

      // Generate a proper foreign key name for the "many" side
      const foreignKeyField = `${oneSideTable.name.toLowerCase()}_${oneKey}`

      // Add to the "one" side - has array of "many" entities
      tableRelationships.get(oneSideTableId)?.push({
        table: manySideTable.name,
        field: `${manySideTable.name.toLowerCase()}s`, // Plural
        type: "one-to-many",
        relationName: `${oneSideTable.name}To${manySideTable.name}`,
      })

      // Add to the "many" side - has reference to "one" entity and foreign key
      tableRelationships.get(manySideTableId)?.push({
        table: oneSideTable.name,
        field: oneSideTable.name.toLowerCase(), // Singular
        type: "many-to-one",
        foreignKeyField: foreignKeyField,
        referencedKey: oneKey,
        relationName: `${oneSideTable.name}To${manySideTable.name}`,
      })
    } else if (relType === "one-to-one") {
      // For one-to-one, we'll make the source side the owner (has the foreign key)
      const foreignKeyField = `${targetTable.name.toLowerCase()}_${rel.targetKey}`

      // Source side (has foreign key)
      tableRelationships.get(rel.source)?.push({
        table: targetTable.name,
        field: targetTable.name.toLowerCase(),
        type: "one-to-one-owner",
        foreignKeyField: foreignKeyField,
        referencedKey: rel.targetKey,
        relationName: `${sourceTable.name}To${targetTable.name}`,
      })

      // Target side (no foreign key)
      tableRelationships.get(rel.target)?.push({
        table: sourceTable.name,
        field: sourceTable.name.toLowerCase(),
        type: "one-to-one-inverse",
        relationName: `${sourceTable.name}To${targetTable.name}`,
      })
    } else if (relType === "many-to-many") {
      // For many-to-many, both sides have arrays
      tableRelationships.get(rel.source)?.push({
        table: targetTable.name,
        field: `${targetTable.name.toLowerCase()}s`,
        type: "many-to-many",
        relationName: `${sourceTable.name}To${targetTable.name}`,
      })

      tableRelationships.get(rel.target)?.push({
        table: sourceTable.name,
        field: `${sourceTable.name.toLowerCase()}s`,
        type: "many-to-many",
        relationName: `${sourceTable.name}To${targetTable.name}`,
      })
    }
  })

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

${(() => {
  const rels = tableRelationships.get(table.id) || []
  if (rels.length === 0) return ""

  let relCode = "  // Relationships\n"

  // Track fields we've already added to avoid duplicates
  const addedFields = new Set(table.columns.map((col) => col.name))

  rels.forEach((rel) => {
    if (rel.type === "one-to-many") {
      // One side of one-to-many has the array of related entities
      relCode += `  ${rel.field} ${rel.table}[] @relation("${rel.relationName}")\n`
    } else if (rel.type === "many-to-one") {
      // Many side of one-to-many has the reference to the one side
      const fkField = rel.foreignKeyField

      relCode += `  ${rel.field} ${rel.table}? @relation("${rel.relationName}", fields: [${fkField}], references: [${rel.referencedKey}])\n`

      // Add foreign key field if it doesn't already exist
      if (!addedFields.has(fkField)) {
        relCode += `  ${fkField} String\n`
        addedFields.add(fkField)
      }
    } else if (rel.type === "one-to-one-owner") {
      const fkField = rel.foreignKeyField

      relCode += `  ${rel.field} ${rel.table}? @relation("${rel.relationName}", fields: [${fkField}], references: [${rel.referencedKey}])\n`

      // Add foreign key field with @unique constraint
      if (!addedFields.has(fkField)) {
        relCode += `  ${fkField} String @unique\n`
        addedFields.add(fkField)
      }
    } else if (rel.type === "one-to-one-inverse") {
      relCode += `  ${rel.field} ${rel.table}? @relation("${rel.relationName}")\n`
    } else if (rel.type === "many-to-many") {
      relCode += `  ${rel.field} ${rel.table}[] @relation("${rel.relationName}")\n`
    }
  })
  return relCode
})()}
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
                : col.type === "boolean"
                  ? "BOOLEAN"
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
  .join(",\n")}${addForeignKeys(table, tables, relationships)}
);

`
  })

  return code
}

// Helper function to add foreign keys to SQL tables
function addForeignKeys(table: TableData, tables: TableData[], relationships: Relationship[]) {
  const foreignKeys = relationships.filter(
    (rel) => rel.target === table.id || (rel.source === table.id && rel.type === "many-to-one"),
  )

  if (foreignKeys.length === 0) return ""

  let fkCode = ",\n\n  -- Foreign Keys"

  foreignKeys.forEach((rel) => {
    const isTarget = rel.target === table.id
    const referencedTableId = isTarget ? rel.source : rel.target
    const referencedTable = tables.find((t) => t.id === referencedTableId)

    if (!referencedTable) return

    const localKey = isTarget ? rel.targetKey : rel.sourceKey
    const foreignKey = isTarget ? rel.sourceKey : rel.targetKey

    fkCode += `,\n  FOREIGN KEY (${localKey}) REFERENCES ${referencedTable.name.toLowerCase()}(${foreignKey})`
  })

  return fkCode
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

  // Add associations
  if (relationships.length > 0) {
    code += `
// Associations
${relationships
  .map((rel) => {
    const sourceTable = tables.find((t) => t.id === rel.source)
    const targetTable = tables.find((t) => t.id === rel.target)

    if (!sourceTable || !targetTable) return ""

    const relType = rel.type || "one-to-many"

    if (relType === "one-to-many") {
      return `${sourceTable.name}.hasMany(${targetTable.name}, { foreignKey: '${rel.targetKey}' });
${targetTable.name}.belongsTo(${sourceTable.name}, { foreignKey: '${rel.targetKey}' });`
    } else if (relType === "one-to-one") {
      return `${sourceTable.name}.hasOne(${targetTable.name}, { foreignKey: '${rel.targetKey}' });
${targetTable.name}.belongsTo(${sourceTable.name}, { foreignKey: '${rel.targetKey}' });`
    } else if (relType === "many-to-many") {
      return `${sourceTable.name}.belongsToMany(${targetTable.name}, { through: '${rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`}' });
${targetTable.name}.belongsToMany(${sourceTable.name}, { through: '${rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`}' });`
    }

    return ""
  })
  .filter(Boolean)
  .join("\n\n")}
`
  }

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

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, ManyToMany, JoinTable } from "typeorm";

`

  // Process relationships to add them to the correct tables
  const tableRelationships = new Map<string, any[]>()

  tables.forEach((table) => {
    tableRelationships.set(table.id, [])
  })

  relationships.forEach((rel) => {
    const sourceTable = tables.find((t) => t.id === rel.source)
    const targetTable = tables.find((t) => t.id === rel.target)

    if (!sourceTable || !targetTable) return

    const relType = rel.type || "one-to-many"

    // Add relationship to source table
    tableRelationships.get(rel.source)?.push({
      table: targetTable.name,
      field: targetTable.name.toLowerCase() + (relType === "one-to-many" ? "s" : ""),
      type: relType,
      inverse: sourceTable.name.toLowerCase(),
    })

    // Add relationship to target table
    tableRelationships.get(rel.target)?.push({
      table: sourceTable.name,
      field: sourceTable.name.toLowerCase(),
      type: relType === "one-to-many" ? "many-to-one" : relType,
      inverse: relType === "one-to-many" ? targetTable.name.toLowerCase() + "s" : targetTable.name.toLowerCase(),
    })
  })

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

${(() => {
  const rels = tableRelationships.get(table.id) || []
  if (rels.length === 0) return ""

  let relCode = "\n  // Relationships\n"
  rels.forEach((rel) => {
    if (rel.type === "one-to-many") {
      relCode += `  @OneToMany(() => ${rel.table}, ${rel.table.toLowerCase()} => ${rel.table.toLowerCase()}.${rel.inverse})
  ${rel.field}: ${rel.table}[];\n\n`
    } else if (rel.type === "many-to-one") {
      relCode += `  @ManyToOne(() => ${rel.table}, ${rel.table.toLowerCase()} => ${rel.table.toLowerCase()}.${rel.inverse})
  ${rel.field}: ${rel.table};\n\n`
    } else if (rel.type === "one-to-one") {
      relCode += `  @OneToOne(() => ${rel.table}, ${rel.table.toLowerCase()} => ${rel.table.toLowerCase()}.${rel.inverse})
  ${rel.field}: ${rel.table};\n\n`
    } else if (rel.type === "many-to-many") {
      relCode += `  @ManyToMany(() => ${rel.table})
  @JoinTable()
  ${rel.field}: ${rel.table}[];\n\n`
    }
  })
  return relCode
})()}
}

`
  })

  return code
}
