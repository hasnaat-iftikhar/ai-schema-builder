"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Code } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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

interface SchemaCodePanelProps {
  tables: TableData[]
  relationships: Relationship[]
  onTablesChange?: (tables: TableData[]) => void
  onRelationshipsChange?: (relationships: Relationship[]) => void
  code?: string
  onCodeChange?: (code: string) => void
}

export function SchemaCodePanel({
  tables,
  relationships,
  onTablesChange,
  onRelationshipsChange,
  code: externalCode,
  onCodeChange,
}: SchemaCodePanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("prisma")
  const [copied, setCopied] = useState(false)
  const [code, setCode] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const formats = [
    { id: "prisma", name: "Prisma" },
    { id: "sql", name: "SQL" },
    { id: "sequelize", name: "Sequelize" },
    { id: "sqlalchemy", name: "SQLAlchemy" },
    { id: "typeorm", name: "TypeORM" },
    { id: "mongoose", name: "Mongoose" },
    { id: "dbml", name: "DBML" },
  ]

  // Generate code based on the selected format and tables/relationships
  useEffect(() => {
    try {
      // Generate code when format changes or tables/relationships change
      const generatedCode = getCodeForFormat(selectedFormat, tables || [], relationships || [])
      setCode(generatedCode)
      if (onCodeChange) {
        onCodeChange(generatedCode)
      }
    } catch (err) {
      console.error("Error generating code:", err)
      setError("An error occurred while generating code. Please try again.")
    }
  }, [selectedFormat, tables, relationships, onCodeChange])

  const getCodeForFormat = (format: string, tables: TableData[], relationships: Relationship[]) => {
    try {
      // Generate code based on the selected format
      switch (format) {
        case "prisma":
          return generatePrismaCode(tables, relationships)
        case "sql":
          return generateSQLCode(tables, relationships)
        case "sequelize":
          return generateSequelizeCode(tables, relationships)
        case "sqlalchemy":
          return generateSQLAlchemyCode(tables, relationships)
        case "typeorm":
          return generateTypeORMCode(tables, relationships)
        case "mongoose":
          return generateMongooseCode(tables, relationships)
        case "dbml":
          return generateDBMLCode(tables, relationships)
        default:
          return "// Select a format to generate code"
      }
    } catch (err) {
      console.error("Error in getCodeForFormat:", err)
      return `// Error generating code for ${format}. Please try again.`
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
    setError(null)
  }

  const toggleEditing = () => {
    if (isEditing) {
      // Try to apply changes
      const validationError = validateCode(code, selectedFormat)
      if (validationError) {
        setError(validationError)
        return
      }

      try {
        // In a real implementation, you would parse the code and update tables/relationships
        setIsEditing(false)
        setError(null)
      } catch (err) {
        setError("Failed to parse the code. Please check for syntax errors.")
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleFormatChange = (newFormat: string) => {
    if (isEditing) {
      // Ask for confirmation before changing format while editing
      if (confirm("Changing format will discard your current edits. Continue?")) {
        setSelectedFormat(newFormat)
        setIsEditing(false)
      }
    } else {
      setSelectedFormat(newFormat)
    }
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
                <DropdownMenuItem key={format.id} onClick={() => handleFormatChange(format.id)}>
                  {format.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="hover:bg-white/10 hover:border-cryptic-accent"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant={isEditing ? "default" : "outline"} onClick={toggleEditing}>
            <Code className="h-4 w-4 mr-2" /> {isEditing ? "Apply Changes" : "Edit Code"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

// Helper functions to generate code for different formats
function generatePrismaCode(tables: TableData[], relationships: Relationship[]) {
  try {
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

    // Process relationships to add relation fields
    const relationFields: Record<string, string[]> = {}

    if (relationships && relationships.length > 0) {
      relationships.forEach((rel) => {
        const sourceTable = tables.find((t) => t.id === rel.source)
        const targetTable = tables.find((t) => t.id === rel.target)

        if (!sourceTable || !targetTable) return

        if (!relationFields[sourceTable.id]) relationFields[sourceTable.id] = []
        if (!relationFields[targetTable.id]) relationFields[targetTable.id] = []

        // Add relation field based on relationship type
        if (rel.type === "one-to-many") {
          // Source has many targets
          relationFields[sourceTable.id].push(`  ${targetTable.name.toLowerCase()}s ${targetTable.name}[]`)
          // Target belongs to source
          relationFields[targetTable.id].push(
            `  ${sourceTable.name.toLowerCase()} ${sourceTable.name} @relation(fields: [${rel.targetKey}], references: [${rel.sourceKey}])`,
          )
          // Add foreign key field if it doesn't exist
          if (!targetTable.columns.some((col) => col.name === rel.targetKey)) {
            relationFields[targetTable.id].push(`  ${rel.targetKey} String`)
          }
        } else if (rel.type === "many-to-one") {
          // Source belongs to target
          relationFields[sourceTable.id].push(
            `  ${targetTable.name.toLowerCase()} ${targetTable.name} @relation(fields: [${rel.sourceKey}], references: [${rel.targetKey}])`,
          )
          // Target has many sources
          relationFields[targetTable.id].push(`  ${sourceTable.name.toLowerCase()}s ${sourceTable.name}[]`)
          // Add foreign key field if it doesn't exist
          if (!sourceTable.columns.some((col) => col.name === rel.sourceKey)) {
            relationFields[sourceTable.id].push(`  ${rel.sourceKey} String`)
          }
        } else if (rel.type === "one-to-one") {
          // Source has one target
          relationFields[sourceTable.id].push(
            `  ${targetTable.name.toLowerCase()} ${targetTable.name}? @relation("${sourceTable.name}To${targetTable.name}")`,
          )
          // Target has one source
          relationFields[targetTable.id].push(
            `  ${sourceTable.name.toLowerCase()} ${sourceTable.name}? @relation("${sourceTable.name}To${targetTable.name}", fields: [${rel.targetKey}], references: [${rel.sourceKey}])`,
          )
          // Add foreign key field if it doesn't exist
          if (!targetTable.columns.some((col) => col.name === rel.targetKey)) {
            relationFields[targetTable.id].push(`  ${rel.targetKey} String @unique`)
          }
        } else if (rel.type === "many-to-many") {
          // Source has many targets
          relationFields[sourceTable.id].push(
            `  ${targetTable.name.toLowerCase()}s ${targetTable.name}[] @relation("${rel.through || `${sourceTable.name}To${targetTable.name}`}")`,
          )
          // Target has many sources
          relationFields[targetTable.id].push(
            `  ${sourceTable.name.toLowerCase()}s ${sourceTable.name}[] @relation("${rel.through || `${sourceTable.name}To${targetTable.name}`}")`,
          )
        }
      })
    }

    tables.forEach((table) => {
      if (!table || !table.columns) return

      code += `model ${table.name} {
  ${table.columns
    .map((col) => {
      if (!col) return ""

      let type =
        col.type === "uuid"
          ? "String @id @default(uuid())"
          : col.type === "varchar"
            ? "String"
            : col.type === "text"
              ? "String"
              : col.type === "integer"
                ? "Int"
                : col.type === "decimal"
                  ? "Float"
                  : col.type === "timestamp"
                    ? "DateTime"
                    : col.type === "boolean"
                      ? "Boolean"
                      : col.type === "date"
                        ? "DateTime"
                        : col.type === "json"
                          ? "Json"
                          : "String"

      if (col.isPrimary && col.type !== "uuid") {
        type += " @id"
        if (col.type === "integer") {
          type += " @default(autoincrement())"
        }
      }
      if (col.isUnique) {
        type += " @unique"
      }

      return `${col.name} ${type}`
    })
    .filter(Boolean)
    .join("\n  ")}
${relationFields[table.id] ? "\n  " + relationFields[table.id].join("\n  ") : ""}
}

`
    })

    return code
  } catch (err) {
    console.error("Error in generatePrismaCode:", err)
    return `// Error generating Prisma code. Please try again.`
  }
}

function generateSQLCode(tables: TableData[], relationships: Relationship[]) {
  try {
    if (!tables || tables.length === 0) {
      return `-- SQL Schema

-- Add tables to your diagram to generate SQL schema
`
    }

    let code = `-- SQL Schema
-- ACID compliant schema with proper foreign key constraints

`

    // First create all tables
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
                : col.type === "decimal"
                  ? "DECIMAL(10, 2)"
                  : col.type === "timestamp"
                    ? "TIMESTAMP WITH TIME ZONE DEFAULT NOW()"
                    : col.type === "boolean"
                      ? "BOOLEAN"
                      : col.type === "date"
                        ? "DATE"
                        : col.type === "json"
                          ? "JSONB"
                          : "VARCHAR(255)"

      const constraints = []

      if (col.isPrimary) {
        if (col.type === "uuid") {
          constraints.push("PRIMARY KEY")
          constraints.push("DEFAULT uuid_generate_v4()")
        } else if (col.type === "integer") {
          constraints.push("PRIMARY KEY")
          constraints.push("GENERATED ALWAYS AS IDENTITY")
        } else {
          constraints.push("PRIMARY KEY")
        }
      }

      if (col.isUnique) {
        constraints.push("UNIQUE")
      }

      return `${col.name} ${type}${constraints.length > 0 ? " " + constraints.join(" ") : ""}`
    })
    .filter(Boolean)
    .join(",\n  ")}
);

`
    })

    // Then add foreign key constraints
    if (relationships && relationships.length > 0) {
      code += `-- Foreign key constraints\n\n`
      relationships.forEach((rel) => {
        if (!rel) return

        const sourceTable = tables.find((t) => t.id === rel.source)
        const targetTable = tables.find((t) => t.id === rel.target)

        if (!sourceTable || !targetTable) return

        if (rel.type === "one-to-many") {
          code += `ALTER TABLE ${targetTable.name.toLowerCase()} ADD COLUMN IF NOT EXISTS ${rel.targetKey} ${getColumnTypeForSQL(sourceTable, rel.sourceKey)};
ALTER TABLE ${targetTable.name.toLowerCase()} ADD CONSTRAINT fk_${targetTable.name.toLowerCase()}_${sourceTable.name.toLowerCase()}
  FOREIGN KEY (${rel.targetKey}) REFERENCES ${sourceTable.name.toLowerCase()} (${rel.sourceKey}) ON DELETE CASCADE;

`
        } else if (rel.type === "many-to-one") {
          code += `ALTER TABLE ${sourceTable.name.toLowerCase()} ADD COLUMN IF NOT EXISTS ${rel.sourceKey} ${getColumnTypeForSQL(targetTable, rel.targetKey)};
ALTER TABLE ${sourceTable.name.toLowerCase()} ADD CONSTRAINT fk_${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}
  FOREIGN KEY (${rel.sourceKey}) REFERENCES ${targetTable.name.toLowerCase()} (${rel.targetKey}) ON DELETE CASCADE;

`
        } else if (rel.type === "one-to-one") {
          code += `ALTER TABLE ${targetTable.name.toLowerCase()} ADD COLUMN IF NOT EXISTS ${rel.targetKey} ${getColumnTypeForSQL(sourceTable, rel.sourceKey)} UNIQUE;
ALTER TABLE ${targetTable.name.toLowerCase()} ADD CONSTRAINT fk_${targetTable.name.toLowerCase()}_${sourceTable.name.toLowerCase()}
  FOREIGN KEY (${rel.targetKey}) REFERENCES ${sourceTable.name.toLowerCase()} (${rel.sourceKey}) ON DELETE CASCADE;

`
        } else if (rel.type === "many-to-many") {
          const junctionTable = rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`

          // Create junction table
          code += `-- Junction table for many-to-many relationship
CREATE TABLE ${junctionTable} (
  ${sourceTable.name.toLowerCase()}_id ${getColumnTypeForSQL(sourceTable, rel.sourceKey)} NOT NULL,
  ${targetTable.name.toLowerCase()}_id ${getColumnTypeForSQL(targetTable, rel.targetKey)} NOT NULL,
  PRIMARY KEY (${sourceTable.name.toLowerCase()}_id, ${targetTable.name.toLowerCase()}_id),
  CONSTRAINT fk_${junctionTable}_${sourceTable.name.toLowerCase()} 
    FOREIGN KEY (${sourceTable.name.toLowerCase()}_id) 
    REFERENCES ${sourceTable.name.toLowerCase()} (${rel.sourceKey}) 
    ON DELETE CASCADE,
  CONSTRAINT fk_${junctionTable}_${targetTable.name.toLowerCase()} 
    FOREIGN KEY (${targetTable.name.toLowerCase()}_id) 
    REFERENCES ${targetTable.name.toLowerCase()} (${rel.targetKey}) 
    ON DELETE CASCADE
);

`
        }
      })

      // Add indexes for performance
      code += `-- Indexes for better query performance\n\n`
      tables.forEach((table) => {
        if (!table) return

        const foreignKeys = relationships
          .filter((rel) => rel.target === table.id)
          .map((rel) => rel.targetKey)
          .concat(
            relationships
              .filter((rel) => rel.source === table.id && rel.type === "many-to-one")
              .map((rel) => rel.sourceKey),
          )

        foreignKeys.forEach((key) => {
          if (!key) return
          code += `CREATE INDEX idx_${table.name.toLowerCase()}_${key} ON ${table.name.toLowerCase()}(${key});\n`
        })

        if (foreignKeys.length > 0) {
          code += "\n"
        }
      })
    }

    return code
  } catch (err) {
    console.error("Error in generateSQLCode:", err)
    return `-- Error generating SQL code. Please try again.`
  }
}

function getColumnTypeForSQL(table: TableData, columnName: string) {
  try {
    if (!table || !table.columns) return "INTEGER"

    const column = table.columns.find((col) => col && col.name === columnName)
    if (!column) return "INTEGER"

    switch (column.type) {
      case "uuid":
        return "UUID"
      case "varchar":
        return "VARCHAR(255)"
      case "integer":
        return "INTEGER"
      case "decimal":
        return "DECIMAL(10, 2)"
      default:
        return "INTEGER"
    }
  } catch (err) {
    console.error("Error in getColumnTypeForSQL:", err)
    return "INTEGER"
  }
}

function generateSequelizeCode(tables: TableData[], relationships: Relationship[]) {
  try {
    if (!tables || tables.length === 0) {
      return `// Sequelize Models

// Add tables to your diagram to generate Sequelize models
`
    }

    let code = `// Sequelize Models

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: false
  }
});

`

    // Define all models first
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
                : col.type === "decimal"
                  ? "DataTypes.DECIMAL(10, 2)"
                  : col.type === "timestamp"
                    ? "DataTypes.DATE"
                    : col.type === "boolean"
                      ? "DataTypes.BOOLEAN"
                      : col.type === "date"
                        ? "DataTypes.DATEONLY"
                        : col.type === "json"
                          ? "DataTypes.JSON"
                          : "DataTypes.STRING"

      const options = []
      if (col.isPrimary) {
        options.push("primaryKey: true")
        if (col.type === "integer") {
          options.push("autoIncrement: true")
        }
      }
      if (col.isUnique) {
        options.push("unique: true")
      }
      if (col.type === "uuid" && col.isPrimary) {
        options.push("defaultValue: Sequelize.UUIDV4")
      }

      return `${col.name}: {
    type: ${type}${options.length > 0 ? ",\n    " + options.join(",\n    ") : ""}
  }`
    })
    .filter(Boolean)
    .join(",\n  ")}
});

`
    })

    // Then define associations
    if (relationships && relationships.length > 0) {
      code += `\n// Associations\n`
      relationships.forEach((rel) => {
        if (!rel) return

        const sourceTable = tables.find((t) => t.id === rel.source)
        const targetTable = tables.find((t) => t.id === rel.target)

        if (!sourceTable || !targetTable) return

        if (rel.type === "one-to-many") {
          code += `${sourceTable.name}.hasMany(${targetTable.name}, { foreignKey: '${rel.targetKey}' });\n`
          code += `${targetTable.name}.belongsTo(${sourceTable.name}, { foreignKey: '${rel.targetKey}' });\n\n`
        } else if (rel.type === "many-to-one") {
          code += `${sourceTable.name}.belongsTo(${targetTable.name}, { foreignKey: '${rel.sourceKey}' });\n`
          code += `${targetTable.name}.hasMany(${sourceTable.name}, { foreignKey: '${rel.sourceKey}' });\n\n`
        } else if (rel.type === "one-to-one") {
          code += `${sourceTable.name}.hasOne(${targetTable.name}, { foreignKey: '${rel.targetKey}' });\n`
          code += `${targetTable.name}.belongsTo(${sourceTable.name}, { foreignKey: '${rel.targetKey}' });\n\n`
        } else if (rel.type === "many-to-many") {
          const through = rel.through || `${sourceTable.name}${targetTable.name}`
          code += `${sourceTable.name}.belongsToMany(${targetTable.name}, { through: '${through}', foreignKey: '${sourceTable.name.toLowerCase()}Id' });\n`
          code += `${targetTable.name}.belongsToMany(${sourceTable.name}, { through: '${through}', foreignKey: '${targetTable.name.toLowerCase()}Id' });\n\n`
        }
      })
    }

    code += `module.exports = {
  sequelize,
  ${tables
    .map((t) => t && t.name)
    .filter(Boolean)
    .join(",\n  ")}
};`

    return code
  } catch (err) {
    console.error("Error in generateSequelizeCode:", err)
    return `// Error generating Sequelize code. Please try again.`
  }
}

function generateSQLAlchemyCode(tables: TableData[], relationships: Relationship[]) {
  try {
    if (!tables || tables.length === 0) {
      return `# SQLAlchemy Models

# Add tables to your diagram to generate SQLAlchemy models
`
    }

    let code = `# SQLAlchemy Models

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()

`

    // Define many-to-many association tables first
    if (relationships && relationships.length > 0) {
      relationships
        .filter((rel) => rel && rel.type === "many-to-many")
        .forEach((rel) => {
          if (!rel) return

          const sourceTable = tables.find((t) => t.id === rel.source)
          const targetTable = tables.find((t) => t.id === rel.target)

          if (!sourceTable || !targetTable) return

          const tableName = rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`

          code += `# Association table for ${sourceTable.name} and ${targetTable.name}
${tableName} = Table(
    '${tableName}',
    Base.metadata,
    Column('${sourceTable.name.toLowerCase()}_id', ForeignKey('${sourceTable.name.toLowerCase()}.${rel.sourceKey}'), primary_key=True),
    Column('${targetTable.name.toLowerCase()}_id', ForeignKey('${targetTable.name.toLowerCase()}.${rel.targetKey}'), primary_key=True)
)

`
        })
    }

    // Define models
    tables.forEach((table) => {
      if (!table || !table.columns) return

      code += `class ${table.name}(Base):
    __tablename__ = '${table.name.toLowerCase()}'

    ${table.columns
      .map((col) => {
        if (!col) return ""

        let type =
          col.type === "uuid"
            ? "Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)"
            : col.type === "varchar"
              ? "Column(String(255))"
              : col.type === "text"
                ? "Column(Text)"
                : col.type === "integer"
                  ? "Column(Integer)"
                  : col.type === "decimal"
                    ? "Column(Float)"
                    : col.type === "timestamp"
                      ? "Column(DateTime, default=datetime.utcnow)"
                      : col.type === "boolean"
                        ? "Column(Boolean)"
                        : col.type === "date"
                          ? "Column(DateTime)"
                          : col.type === "json"
                            ? "Column(JSON)"
                            : "Column(String(255))"

        if (col.isPrimary && col.type !== "uuid") {
          if (col.type === "integer") {
            type = "Column(Integer, primary_key=True, autoincrement=True)"
          } else {
            type = type.replace("Column(", "Column(primary_key=True, ")
          }
        }
        if (col.isUnique) {
          type = type.replace("Column(", "Column(unique=True, ")
        }

        // Add foreign key references
        if (relationships && relationships.length > 0) {
          const foreignRel = relationships.find(
            (rel) =>
              rel &&
              ((rel.source === table.id && rel.sourceKey === col.name) ||
                (rel.target === table.id && rel.targetKey === col.name)),
          )

          if (foreignRel && foreignRel.type === "many-to-one" && foreignRel.source === table.id) {
            const targetTable = tables.find((t) => t.id === foreignRel.target)
            if (targetTable) {
              type = `Column(ForeignKey('${targetTable.name.toLowerCase()}.${foreignRel.targetKey}'))`
            }
          }
        }

        return `${col.name} = ${type}`
      })
      .filter(Boolean)
      .join("\n    ")}

    # Relationships
${getRelationshipsForSQLAlchemy(table.id, tables, relationships)}
`
    })

    return code
  } catch (err) {
    console.error("Error in generateSQLAlchemyCode:", err)
    return `# Error generating SQLAlchemy code. Please try again.`
  }
}

function getRelationshipsForSQLAlchemy(tableId: string, tables: TableData[], relationships: Relationship[]) {
  try {
    const result: string[] = []

    if (!relationships || relationships.length === 0) return ""

    relationships.forEach((rel) => {
      if (!rel) return

      const sourceTable = tables.find((t) => t.id === rel.source)
      const targetTable = tables.find((t) => t.id === rel.target)

      if (!sourceTable || !targetTable) return

      if (rel.source === tableId) {
        if (rel.type === "one-to-many") {
          result.push(
            `    ${targetTable.name.toLowerCase()}s = relationship("${targetTable.name}", back_populates="${sourceTable.name.toLowerCase()}")`,
          )
        } else if (rel.type === "many-to-one") {
          result.push(
            `    ${targetTable.name.toLowerCase()} = relationship("${targetTable.name}", back_populates="${sourceTable.name.toLowerCase()}s")`,
          )
        } else if (rel.type === "one-to-one") {
          result.push(
            `    ${targetTable.name.toLowerCase()} = relationship("${targetTable.name}", uselist=False, back_populates="${sourceTable.name.toLowerCase()}")`,
          )
        } else if (rel.type === "many-to-many") {
          const tableName = rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`
          result.push(
            `    ${targetTable.name.toLowerCase()}s = relationship("${targetTable.name}", secondary=${tableName}, back_populates="${sourceTable.name.toLowerCase()}s")`,
          )
        }
      } else if (rel.target === tableId) {
        if (rel.type === "one-to-many") {
          result.push(
            `    ${sourceTable.name.toLowerCase()} = relationship("${sourceTable.name}", back_populates="${targetTable.name.toLowerCase()}s")`,
          )
        } else if (rel.type === "many-to-one") {
          result.push(
            `    ${sourceTable.name.toLowerCase()}s = relationship("${sourceTable.name}", back_populates="${targetTable.name.toLowerCase()}")`,
          )
        } else if (rel.type === "one-to-one") {
          result.push(
            `    ${sourceTable.name.toLowerCase()} = relationship("${sourceTable.name}", uselist=False, back_populates="${targetTable.name.toLowerCase()}")`,
          )
        } else if (rel.type === "many-to-many") {
          const tableName = rel.through || `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}`
          result.push(
            `    ${sourceTable.name.toLowerCase()}s = relationship("${sourceTable.name}", secondary=${tableName}, back_populates="${targetTable.name.toLowerCase()}s")`,
          )
        }
      }
    })

    return result.join("\n")
  } catch (err) {
    console.error("Error in getRelationshipsForSQLAlchemy:", err)
    return "    # Error generating relationships"
  }
}

function generateTypeORMCode(tables: TableData[], relationships: Relationship[]) {
  try {
    if (!tables || tables.length === 0) {
      return `// TypeORM Entities

// Add tables to your diagram to generate TypeORM entities
`
    }

    let code = `// TypeORM Entities

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, OneToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm";

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

      if (col.type === "integer" || col.type === "decimal") {
        type = "number"
      } else if (col.type === "boolean") {
        type = "boolean"
      } else if (col.type === "timestamp" || col.type === "date") {
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

${getRelationshipsForTypeORM(table.id, tables, relationships)}
}

`
    })

    return code
  } catch (err) {
    console.error("Error in generateTypeORMCode:", err)
    return `// Error generating TypeORM code. Please try again.`
  }
}

function getRelationshipsForTypeORM(tableId: string, tables: TableData[], relationships: Relationship[]) {
  try {
    const result: string[] = []

    if (!relationships || relationships.length === 0) return ""

    relationships.forEach((rel) => {
      if (!rel) return

      const sourceTable = tables.find((t) => t.id === rel.source)
      const targetTable = tables.find((t) => t.id === rel.target)

      if (!sourceTable || !targetTable) return

      if (rel.source === tableId) {
        if (rel.type === "one-to-many") {
          result.push(`  @OneToMany(() => ${targetTable.name}, ${targetTable.name.toLowerCase()} => ${targetTable.name.toLowerCase()}.${sourceTable.name.toLowerCase()})
  ${targetTable.name.toLowerCase()}s: ${targetTable.name}[];`)
        } else if (rel.type === "many-to-one") {
          result.push(`  @ManyToOne(() => ${targetTable.name}, ${targetTable.name.toLowerCase()} => ${targetTable.name.toLowerCase()}.${sourceTable.name.toLowerCase()}s)
  ${targetTable.name.toLowerCase()}: ${targetTable.name};`)
        } else if (rel.type === "one-to-one") {
          result.push(`  @OneToOne(() => ${targetTable.name}, ${targetTable.name.toLowerCase()} => ${targetTable.name.toLowerCase()}.${sourceTable.name.toLowerCase()})
  ${targetTable.name.toLowerCase()}: ${targetTable.name};`)
        } else if (rel.type === "many-to-many") {
          result.push(`  @ManyToMany(() => ${targetTable.name}, ${targetTable.name.toLowerCase()} => ${targetTable.name.toLowerCase()}.${sourceTable.name.toLowerCase()}s)
  @JoinTable()
  ${targetTable.name.toLowerCase()}s: ${targetTable.name}[];`)
        }
      } else if (rel.target === tableId) {
        if (rel.type === "one-to-many") {
          result.push(`  @ManyToOne(() => ${sourceTable.name}, ${sourceTable.name.toLowerCase()} => ${sourceTable.name.toLowerCase()}.${targetTable.name.toLowerCase()}s)
  ${sourceTable.name.toLowerCase()}: ${sourceTable.name};`)
        } else if (rel.type === "many-to-one") {
          result.push(`  @OneToMany(() => ${sourceTable.name}, ${sourceTable.name.toLowerCase()} => ${sourceTable.name.toLowerCase()}.${targetTable.name.toLowerCase()})
  ${sourceTable.name.toLowerCase()}s: ${sourceTable.name}[];`)
        } else if (rel.type === "one-to-one") {
          result.push(`  @OneToOne(() => ${sourceTable.name}, ${sourceTable.name.toLowerCase()} => ${sourceTable.name.toLowerCase()}.${targetTable.name.toLowerCase()})
  @JoinColumn()
  ${sourceTable.name.toLowerCase()}: ${sourceTable.name};`)
        } else if (rel.type === "many-to-many") {
          result.push(`  @ManyToMany(() => ${sourceTable.name}, ${sourceTable.name.toLowerCase()} => ${sourceTable.name.toLowerCase()}.${targetTable.name.toLowerCase()}s)
  ${sourceTable.name.toLowerCase()}s: ${sourceTable.name}[];`)
        }
      }
    })

    return result.join("\n\n")
  } catch (err) {
    console.error("Error in getRelationshipsForTypeORM:", err)
    return "  // Error generating relationships"
  }
}

function generateMongooseCode(tables: TableData[], relationships: Relationship[]) {
  try {
    if (!tables || tables.length === 0) {
      return `// Mongoose Models

// Add tables to your diagram to generate Mongoose models
`
    }

    let code = `// Mongoose Models

const mongoose = require('mongoose');
const { Schema } = mongoose;

`

    // Define schemas
    tables.forEach((table) => {
      if (!table || !table.columns) return

      code += `// ${table.name} Schema
const ${table.name.toLowerCase()}Schema = new Schema({
  ${table.columns
    .map((col) => {
      if (!col) return ""

      let type = "String"
      const options = []

      if (col.type === "integer" || col.type === "decimal") {
        type = "Number"
      } else if (col.type === "boolean") {
        type = "Boolean"
      } else if (col.type === "timestamp" || col.type === "date") {
        type = "Date"
      } else if (col.type === "json") {
        type = "Schema.Types.Mixed"
      }

      if (col.isPrimary) {
        if (col.type === "uuid") {
          return `${col.name}: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    required: true,
    unique: true
  }`
        } else {
          options.push("required: true")
          options.push("unique: true")
        }
      }

      if (col.isUnique) {
        options.push("unique: true")
      }

      // Check if this is a foreign key
      if (relationships && relationships.length > 0) {
        const foreignRel = relationships.find(
          (rel) =>
            rel &&
            ((rel.source === table.id && rel.sourceKey === col.name) ||
              (rel.target === table.id && rel.targetKey === col.name)),
        )

        if (foreignRel) {
          if (
            (foreignRel.source === table.id &&
              foreignRel.sourceKey === col.name &&
              foreignRel.type === "many-to-one") ||
            (foreignRel.target === table.id && foreignRel.targetKey === col.name)
          ) {
            const otherTableId = foreignRel.source === table.id ? foreignRel.target : foreignRel.source
            const otherTable = tables.find((t) => t.id === otherTableId)

            if (otherTable) {
              return `${col.name}: {
    type: Schema.Types.ObjectId,
    ref: '${otherTable.name}'
  }`
            }
          }
        }
      }

      return `${col.name}: {
    type: ${type}${options.length > 0 ? ",\n    " + options.join(",\n    ") : ""}
  }`
    })
    .filter(Boolean)
    .join(",\n  ")}
}, { timestamps: true });

${getRelationshipsForMongoose(table.id, tables, relationships)}

const ${table.name} = mongoose.model('${table.name}', ${table.name.toLowerCase()}Schema);

`
    })

    code += `module.exports = {
  ${tables
    .map((table) => table && table.name)
    .filter(Boolean)
    .join(",\n  ")}
};`

    return code
  } catch (err) {
    console.error("Error in generateMongooseCode:", err)
    return `// Error generating Mongoose code. Please try again.`
  }
}

function getRelationshipsForMongoose(tableId: string, tables: TableData[], relationships: Relationship[]) {
  try {
    const result: string[] = []

    if (!relationships || relationships.length === 0) return ""

    // For mongoose, we typically handle relationships with middleware or virtual fields
    relationships.forEach((rel) => {
      if (!rel) return

      const sourceTable = tables.find((t) => t.id === rel.source)
      const targetTable = tables.find((t) => t.id === rel.target)

      if (!sourceTable || !targetTable) return

      if (rel.source === tableId) {
        if (rel.type === "one-to-many" || rel.type === "many-to-many") {
          result.push(`// Virtual field for ${targetTable.name.toLowerCase()}s
${sourceTable.name.toLowerCase()}Schema.virtual('${targetTable.name.toLowerCase()}s', {
  ref: '${targetTable.name}',
  localField: '${rel.sourceKey}',
  foreignField: '${rel.targetKey}'
});`)
        }
      }
    })

    return result.join("\n\n")
  } catch (err) {
    console.error("Error in getRelationshipsForMongoose:", err)
    return "// Error generating relationships"
  }
}

function generateDBMLCode(tables: TableData[], relationships: Relationship[]) {
  try {
    if (!tables || tables.length === 0) {
      return `// DBML Schema

// Add tables to your diagram to generate DBML schema
`
    }

    let code = `// DBML Schema

`

    // Define tables
    tables.forEach((table) => {
      if (!table || !table.columns) return

      code += `Table ${table.name} {
  ${table.columns
    .map((col) => {
      if (!col) return ""

      const type =
        col.type === "uuid"
          ? "uuid"
          : col.type === "varchar"
            ? "varchar"
            : col.type === "text"
              ? "text"
              : col.type === "integer"
                ? "integer"
                : col.type === "decimal"
                  ? "decimal"
                  : col.type === "timestamp"
                    ? "timestamp"
                    : col.type === "boolean"
                      ? "boolean"
                      : col.type === "date"
                        ? "date"
                        : col.type === "json"
                          ? "json"
                          : "varchar"

      const options = []
      if (col.isPrimary) {
        options.push("pk")
      }
      if (col.isUnique) {
        options.push("unique")
      }
      if (col.type === "integer" && col.isPrimary) {
        options.push("increment")
      }

      return `${col.name} ${type}${options.length > 0 ? " [" + options.join(", ") + "]" : ""}`
    })
    .filter(Boolean)
    .join("\n  ")}
}

`
    })

    // Define relationships
    if (relationships && relationships.length > 0) {
      relationships.forEach((rel) => {
        if (!rel) return

        const sourceTable = tables.find((t) => t.id === rel.source)
        const targetTable = tables.find((t) => t.id === rel.target)

        if (!sourceTable || !targetTable) return

        if (rel.type === "one-to-many") {
          code += `Ref: ${sourceTable.name}.${rel.sourceKey} < ${targetTable.name}.${rel.targetKey}\n`
        } else if (rel.type === "many-to-one") {
          code += `Ref: ${sourceTable.name}.${rel.sourceKey} > ${targetTable.name}.${rel.targetKey}\n`
        } else if (rel.type === "one-to-one") {
          code += `Ref: ${sourceTable.name}.${rel.sourceKey} - ${targetTable.name}.${rel.targetKey}\n`
        } else if (rel.type === "many-to-many") {
          code += `Ref: ${sourceTable.name}.${rel.sourceKey} <> ${targetTable.name}.${rel.targetKey}\n`
        }
      })
    }

    return code
  } catch (err) {
    console.error("Error in generateDBMLCode:", err)
    return `// Error generating DBML code. Please try again.`
  }
}

function validateCode(code: string, format: string): string | null {
  try {
    if (!code || !code.trim()) {
      return "Code cannot be empty"
    }

    switch (format) {
      case "sql":
        // Basic SQL validation
        if (!code.toLowerCase().includes("create table")) {
          return "No CREATE TABLE statements found in SQL"
        }
        break
      case "prisma":
        // Basic Prisma validation
        if (!code.toLowerCase().includes("model ")) {
          return "No models found in Prisma schema"
        }
        break
      // Add validation for other formats as needed
    }

    return null
  } catch (err) {
    console.error("Error in validateCode:", err)
    return "Error validating code"
  }
}
