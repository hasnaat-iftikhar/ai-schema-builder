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
    <div className="p-4 w-full h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Schema Documentation</CardTitle>
          <CardDescription>Automatically generated documentation for your database schema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Project Overview</h3>
            <p className="text-muted-foreground">{project.description || "No description provided yet."}</p>
            <div className="mt-2">
              <span className="text-sm font-medium">Tables:</span>{" "}
              <span className="text-sm text-muted-foreground">{project.tables.length}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Relationships:</span>{" "}
              <span className="text-sm text-muted-foreground">{project.relationships.length}</span>
            </div>
          </div>

          {project.tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No tables yet</h3>
              <p className="text-muted-foreground">Create tables in the diagram editor to generate documentation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.tables.map((table) => (
                <div key={table.id} className="border border-white/10 rounded-md p-4">
                  <h4 className="font-medium">{table.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{table.columns.length} columns</p>
                  <div className="border border-white/10 rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-cryptic-block">
                        <tr>
                          <th className="text-left p-2">Column</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Attributes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
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
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-2" disabled={project.tables.length === 0}>
            <FileText className="h-4 w-4" /> Export as HTML
          </Button>
          <Button className="gap-2 bg-cryptic-accent text-black" disabled={project.tables.length === 0}>
            <Download className="h-4 w-4" /> Export as PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
