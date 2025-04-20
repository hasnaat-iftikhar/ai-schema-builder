"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download } from "lucide-react"
import { useState } from "react"

interface Project {
  id: string
  name: string
  description: string
  tables: any[]
  relationships: any[]
}

interface CodeGenerationProps {
  project: Project
}

export function CodeGeneration({ project }: CodeGenerationProps) {
  const [activeTab, setActiveTab] = useState("prisma")

  // Mock code examples
  const prismaCode = `// Prisma schema for ${project.name}

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${project.tables
  .map(
    (table) => `model ${table.name} {
  ${table.columns
    .map((col) => {
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
                    : "String"

      if (col.isPrimary && col.type !== "uuid") {
        type += " @id"
      }
      if (col.isUnique) {
        type += " @unique"
      }

      return `${col.name} ${type}`
    })
    .join("\n  ")}
  
  ${project.relationships
    .filter((rel) => rel.source === table.id)
    .map((rel) => {
      const targetTable = project.tables.find((t) => t.id === rel.target)
      return `${targetTable.name.toLowerCase()}s ${targetTable.name}[]`
    })
    .join("\n  ")}
  
  ${project.relationships
    .filter((rel) => rel.target === table.id)
    .map((rel) => {
      const sourceTable = project.tables.find((t) => t.id === rel.source)
      const sourceCol = sourceTable.columns.find((col) => col.name === rel.sourceKey)
      return `${sourceTable.name.toLowerCase()} ${sourceTable.name} @relation(fields: [${rel.targetKey}], references: [${rel.sourceKey}])`
    })
    .join("\n  ")}
}
`,
  )
  .join("\n\n")}`

  const sqlCode = `-- SQL schema for ${project.name}

${project.tables
  .map(
    (table) => `CREATE TABLE ${table.name.toLowerCase()} (
  ${table.columns
    .map((col) => {
      let type =
        col.type === "uuid"
          ? "UUID PRIMARY KEY DEFAULT uuid_generate_v4()"
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
                    : "VARCHAR(255)"

      if (col.isPrimary && col.type !== "uuid") {
        type += " PRIMARY KEY"
      }
      if (col.isUnique) {
        type += " UNIQUE"
      }

      return `${col.name} ${type}`
    })
    .join(",\n  ")}${project.relationships
    .filter((rel) => rel.target === table.id)
    .map((rel) => {
      const sourceTable = project.tables.find((t) => t.id === rel.source)
      return `,\n  FOREIGN KEY (${rel.targetKey}) REFERENCES ${sourceTable.name.toLowerCase()}(${rel.sourceKey})`
    })
    .join("")}
);`,
  )
  .join("\n\n")}`

  const typescriptCode = `// TypeScript types for ${project.name}

${project.tables
  .map(
    (table) => `interface ${table.name} {
  ${table.columns
    .map((col) => {
      const type =
        col.type === "uuid"
          ? "string"
          : col.type === "varchar"
            ? "string"
            : col.type === "text"
              ? "string"
              : col.type === "integer"
                ? "number"
                : col.type === "decimal"
                  ? "number"
                  : col.type === "timestamp"
                    ? "Date"
                    : col.type === "boolean"
                      ? "boolean"
                      : "string"

      return `${col.name}: ${type};`
    })
    .join("\n  ")}
  
  ${project.relationships
    .filter((rel) => rel.source === table.id)
    .map((rel) => {
      const targetTable = project.tables.find((t) => t.id === rel.target)
      return `${targetTable.name.toLowerCase()}s?: ${targetTable.name}[];`
    })
    .join("\n  ")}
  
  ${project.relationships
    .filter((rel) => rel.target === table.id)
    .map((rel) => {
      const sourceTable = project.tables.find((t) => t.id === rel.source)
      return `${sourceTable.name.toLowerCase()}?: ${sourceTable.name};`
    })
    .join("\n  ")}
}`,
  )
  .join("\n\n")}`

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Code Generation</CardTitle>
          <CardDescription>Generate database code from your schema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="prisma">Prisma</TabsTrigger>
              <TabsTrigger value="sql">SQL</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
            </TabsList>
            <TabsContent value="prisma" className="mt-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
                  <code>{prismaCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(prismaCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="sql" className="mt-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
                  <code>{sqlCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(sqlCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="typescript" className="mt-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
                  <code>{typescriptCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(typescriptCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Regenerate Code</Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
