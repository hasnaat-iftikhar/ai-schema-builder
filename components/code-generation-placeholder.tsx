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
  const prismaCode = `// Prisma schema for ${project.name || "New Project"}

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Your schema will appear here once you create tables in the diagram editor
`

  const sqlCode = `-- SQL schema for ${project.name || "New Project"}

-- Your SQL schema will appear here once you create tables in the diagram editor
`

  const typescriptCode = `// TypeScript types for ${project.name || "New Project"}

// Your TypeScript types will appear here once you create tables in the diagram editor
`

  return (
    <div className="p-4 w-full h-full">
      <Card className="h-full flex flex-col">
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
                <pre className="bg-cryptic-block p-4 rounded-md overflow-auto max-h-[400px] text-sm">
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
                <pre className="bg-cryptic-block p-4 rounded-md overflow-auto max-h-[400px] text-sm">
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
                <pre className="bg-cryptic-block p-4 rounded-md overflow-auto max-h-[400px] text-sm">
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
          <Button variant="outline" disabled>
            Regenerate Code
          </Button>
          <Button className="gap-2 bg-cryptic-accent text-black" disabled>
            <Download className="h-4 w-4" /> Download
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
