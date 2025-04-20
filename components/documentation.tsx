"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  tables: any[]
  relationships: any[]
}

interface DocumentationProps {
  project: Project
}

export function Documentation({ project }: DocumentationProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Schema Documentation</CardTitle>
          <CardDescription>Automatically generated documentation for your database schema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Project Overview</h3>
            <p className="text-muted-foreground">{project.description}</p>
            <div className="mt-2">
              <span className="text-sm font-medium">Tables:</span>{" "}
              <span className="text-sm text-muted-foreground">{project.tables.length}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Relationships:</span>{" "}
              <span className="text-sm text-muted-foreground">{project.relationships.length}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Tables</h3>
            <div className="space-y-4">
              {project.tables.map((table) => (
                <div key={table.id} className="border rounded-md p-4">
                  <h4 className="font-medium">{table.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{table.columns.length} columns</p>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2">Column</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Attributes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {table.columns.map((column, idx) => (
                          <tr key={idx}>
                            <td className="p-2">{column.name}</td>
                            <td className="p-2">{column.type}</td>
                            <td className="p-2">
                              {column.isPrimary && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 mr-1">
                                  Primary
                                </span>
                              )}
                              {column.isUnique && (
                                <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 mr-1">
                                  Unique
                                </span>
                              )}
                              {column.isForeign && (
                                <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-0.5">
                                  Foreign
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Relationships</h3>
            <div className="space-y-2">
              {project.relationships.map((rel) => {
                const sourceTable = project.tables.find((t) => t.id === rel.source)
                const targetTable = project.tables.find((t) => t.id === rel.target)

                return (
                  <div key={rel.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{sourceTable.name}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">{targetTable.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rel.through ? "Many-to-Many" : "One-to-Many"}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {sourceTable.name}.{rel.sourceKey} → {targetTable.name}.{rel.targetKey}
                      {rel.through && <span> (through {rel.through})</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" /> Export as HTML
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export as PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
