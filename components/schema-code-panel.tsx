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

    // Generate unique foreign key field names to avoid conflicts
    const sourceFKField = `${targetTable.name.toLowerCase()}_${rel.targetKey}`
    const targetFKField = `${sourceTable.name.toLowerCase()}_${rel.sourceKey}`

    // Add relationship to source table
    tableRelationships.get(rel.source)?.push({
      table: targetTable.name,
      field: targetTable.name.toLowerCase() + (relType === "one-to-many" ? "s" : ""),
      type: relType,
      sourceKey: rel.sourceKey,
      targetKey: rel.targetKey,
      fkField: sourceFKField,
      relationName: `${sourceTable.name}To${targetTable.name}`,
    })

    // Add relationship to target table
    tableRelationships.get(rel.target)?.push({
      table: sourceTable.name,
      field: sourceTable.name.toLowerCase(),
      type: relType === "one-to-many" ? "many-to-one" : relType,
      sourceKey: rel.targetKey,
      targetKey: rel.sourceKey,
      fkField: targetFKField,
      relationName: `${sourceTable.name}To${targetTable.name}`,
    })
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
      relCode += `  ${rel.field} ${rel.table}? @relation("${rel.relationName}", fields: [${rel.fkField}], references: [${rel.targetKey}])\n`

      // Add foreign key field if it doesn't already exist
      if (!addedFields.has(rel.fkField)) {
        relCode += `  ${rel.fkField} String\n`
        addedFields.add(rel.fkField)
      }
    } else if (rel.type === "one-to-one") {
      // For one-to-one, only one side should have the foreign key
      if (!rel.isSecondary) {
        relCode += `  ${rel.field} ${rel.table}? @relation("${rel.relationName}", fields: [${rel.fkField}], references: [${rel.targetKey}])\n`

        // Add foreign key field with @unique constraint
        if (!addedFields.has(rel.fkField)) {
          relCode += `  ${rel.fkField} String @unique\n`
          addedFields.add(rel.fkField)
        }
      } else {
        relCode += `  ${rel.field} ${rel.table}? @relation("${rel.relationName}")\n`
      }
    } else if (rel.type === "many-to-many") {
      // For many-to-many, both sides have arrays
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
  .join(",\n")}${addForeignKeysSQL(table, tables, relationships)}
);

`
  })

  // Add junction tables for many-to-many relationships
  const manyToManyRels = relationships.filter((rel) => rel.type === "many-to-many")
  if (manyToManyRels.length > 0) {
    code += "\n-- Junction tables for many-to-many relationships\n\n"

    manyToManyRels.forEach((rel) => {
      const sourceTable = tables.find((t) => t.id === rel.source)
      const targetTable = tables.find((t) => t.id === rel.target)

      if (!sourceTable || !targetTable) return

      const junctionTableName = rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`

      code += `CREATE TABLE ${junctionTableName} (
  ${sourceTable.name.toLowerCase()}_${rel.sourceKey} UUID NOT NULL,
  ${targetTable.name.toLowerCase()}_${rel.targetKey} UUID NOT NULL,
  PRIMARY KEY (${sourceTable.name.toLowerCase()}_${rel.sourceKey}, ${targetTable.name.toLowerCase()}_${rel.targetKey}),
  FOREIGN KEY (${sourceTable.name.toLowerCase()}_${rel.sourceKey}) REFERENCES ${sourceTable.name.toLowerCase()}(${rel.sourceKey}),
  FOREIGN KEY (${targetTable.name.toLowerCase()}_${rel.targetKey}) REFERENCES ${targetTable.name.toLowerCase()}(${rel.targetKey})
);

`
    })
  }

  return code
}

// Helper function to add foreign keys to SQL tables
function addForeignKeysSQL(table: TableData, tables: TableData[], relationships: Relationship[]) {
  // Find relationships where this table is the "many" side (contains the foreign key)
  const foreignKeys = relationships.filter(
    (rel) =>
      (rel.target === table.id && (rel.type === "one-to-many" || !rel.type)) ||
      (rel.source === table.id && rel.type === "many-to-one") ||
      (rel.target === table.id && rel.type === "one-to-one"),
  )

  if (foreignKeys.length === 0) return ""

  let fkCode = ",\n\n  -- Foreign Keys"

  // Add foreign key columns first
  foreignKeys.forEach((rel) => {
    const isTarget = rel.target === table.id
    const referencedTableId = isTarget ? rel.source : rel.target
    const referencedTable = tables.find((t) => t.id === referencedTableId)

    if (!referencedTable) return

    // Generate a unique foreign key column name
    const fkColumnName = `${referencedTable.name.toLowerCase()}_${isTarget ? rel.sourceKey : rel.targetKey}`

    // Check if the column already exists in the table
    const columnExists = table.columns.some((col) => col.name === fkColumnName)

    if (!columnExists) {
      fkCode += `,\n  ${fkColumnName} UUID`
    }
  })

  // Then add foreign key constraints
  foreignKeys.forEach((rel) => {
    const isTarget = rel.target === table.id
    const referencedTableId = isTarget ? rel.source : rel.target
    const referencedTable = tables.find((t) => t.id === referencedTableId)

    if (!referencedTable) return

    // Generate a unique foreign key column name
    const fkColumnName = `${referencedTable.name.toLowerCase()}_${isTarget ? rel.sourceKey : rel.targetKey}`
    const referencedColumnName = isTarget ? rel.sourceKey : rel.targetKey

    fkCode += `,\n  FOREIGN KEY (${fkColumnName}) REFERENCES ${referencedTable.name.toLowerCase()}(${referencedColumnName})`

    // Add unique constraint for one-to-one relationships
    if (rel.type === "one-to-one") {
      fkCode += `,\n  UNIQUE (${fkColumnName})`
    }
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

      if (col.type === "uuid") {
        options.push("defaultValue: Sequelize.UUIDV4")
      } else if (col.type === "integer") {
        options.push("autoIncrement: true")
      }
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

    // Generate unique foreign key names
    const foreignKey = `${sourceTable.name.toLowerCase()}_${rel.sourceKey}`

    if (relType === "one-to-many") {
      return `${sourceTable.name}.hasMany(${targetTable.name}, { 
  foreignKey: '${foreignKey}',
  sourceKey: '${rel.sourceKey}'
});
${targetTable.name}.belongsTo(${sourceTable.name}, { 
  foreignKey: '${foreignKey}',
  targetKey: '${rel.sourceKey}'
});`
    } else if (relType === "many-to-one") {
      return `${targetTable.name}.hasMany(${sourceTable.name}, { 
  foreignKey: '${foreignKey}',
  sourceKey: '${rel.targetKey}'
});
${sourceTable.name}.belongsTo(${targetTable.name}, { 
  foreignKey: '${foreignKey}',
  targetKey: '${rel.targetKey}'
});`
    } else if (relType === "one-to-one") {
      return `${sourceTable.name}.hasOne(${targetTable.name}, { 
  foreignKey: '${foreignKey}',
  sourceKey: '${rel.sourceKey}'
});
${targetTable.name}.belongsTo(${sourceTable.name}, { 
  foreignKey: '${foreignKey}',
  targetKey: '${rel.sourceKey}'
});`
    } else if (relType === "many-to-many") {
      const through = rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`
      return `${sourceTable.name}.belongsToMany(${targetTable.name}, { 
  through: '${through}',
  foreignKey: '${sourceTable.name.toLowerCase()}_${rel.sourceKey}',
  otherKey: '${targetTable.name.toLowerCase()}_${rel.targetKey}'
});
${targetTable.name}.belongsToMany(${sourceTable.name}, { 
  through: '${through}',
  foreignKey: '${targetTable.name.toLowerCase()}_${rel.targetKey}',
  otherKey: '${sourceTable.name.toLowerCase()}_${rel.sourceKey}'
});`
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

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm";

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

    // Generate unique foreign key names
    const sourceFKField = `${targetTable.name.toLowerCase()}${rel.targetKey.charAt(0).toUpperCase() + rel.targetKey.slice(1)}`
    const targetFKField = `${sourceTable.name.toLowerCase()}${rel.sourceKey.charAt(0).toUpperCase() + rel.sourceKey.slice(1)}`

    // Add relationship to source table
    tableRelationships.get(rel.source)?.push({
      table: targetTable.name,
      field: targetTable.name.toLowerCase() + (relType === "one-to-many" ? "s" : ""),
      type: relType,
      inverse: sourceTable.name.toLowerCase(),
      fkField: sourceFKField,
      sourceKey: rel.sourceKey,
      targetKey: rel.targetKey,
      isOwner: relType === "many-to-one" || relType === "one-to-one",
    })

    // Add relationship to target table
    tableRelationships.get(rel.target)?.push({
      table: sourceTable.name,
      field: sourceTable.name.toLowerCase(),
      type: relType === "one-to-many" ? "many-to-one" : relType,
      inverse: relType === "one-to-many" ? targetTable.name.toLowerCase() + "s" : targetTable.name.toLowerCase(),
      fkField: targetFKField,
      sourceKey: rel.targetKey,
      targetKey: rel.sourceKey,
      isOwner:
        relType === "one-to-many" ||
        (relType === "one-to-one" &&
          !tableRelationships.get(rel.source)?.some((r) => r.type === "one-to-one" && r.table === targetTable.name)),
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

      // Add foreign key column if this is the owner side
      if (rel.isOwner) {
        relCode += `  @Column({ nullable: true })
  ${rel.fkField}: string;\n\n`
      }
    } else if (rel.type === "one-to-one") {
      if (rel.isOwner) {
        relCode += `  @OneToOne(() => ${rel.table}, ${rel.table.toLowerCase()} => ${rel.table.toLowerCase()}.${rel.inverse})
  @JoinColumn({ name: "${rel.fkField}" })
  ${rel.field}: ${rel.table};\n\n`

        // Add foreign key column
        relCode += `  @Column({ nullable: true })
  ${rel.fkField}: string;\n\n`
      } else {
        relCode += `  @OneToOne(() => ${rel.table}, ${rel.table.toLowerCase()} => ${rel.table.toLowerCase()}.${rel.inverse})
  ${rel.field}: ${rel.table};\n\n`
      }
    } else if (rel.type === "many-to-many") {
      relCode += `  @ManyToMany(() => ${rel.table}, ${rel.table.toLowerCase()} => ${rel.table.toLowerCase()}.${rel.inverse})
  @JoinTable({
    name: "${table.name.toLowerCase()}_${rel.table.toLowerCase()}",
    joinColumn: { name: "${table.name.toLowerCase()}_${rel.sourceKey}", referencedColumnName: "${rel.sourceKey}" },
    inverseJoinColumn: { name: "${rel.table.toLowerCase()}_${rel.targetKey}", referencedColumnName: "${rel.targetKey}" }
  })
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
