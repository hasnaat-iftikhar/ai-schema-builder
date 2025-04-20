"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentationPanelProps {
  tables: any[]
  relationships: any[]
}

export function DocumentationPanel({ tables, relationships }: DocumentationPanelProps) {
  return (
    <div className="w-full h-full overflow-auto p-4">
      {tables.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div
            className="bg-cryptic-block p-6 flex justify-start items-center gap-3"
            style={{
              maxWidth: "320px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              flexDirection: "column",
              textAlign: "center",
              borderRadius: "16px",
              gap: "12px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "24px", height: "24px", margin: 0 }}
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div className="flex flex-col gap-1" style={{ gap: 0, textAlign: "center" }}>
              <h3 className="text-[14px] font-medium text-left" style={{ textAlign: "center", fontSize: "16px" }}>
                No tables yet
              </h3>
              <p className="text-[14px] text-muted-foreground text-left" style={{ textAlign: "center" }}>
                Create tables in the diagram editor to generate documentation
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Schema Documentation</CardTitle>
            <CardDescription>Automatically generated documentation for your database schema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Tables Overview</h3>
              <div className="space-y-4">
                {tables.map((table) => (
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
            </div>

            {relationships.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Relationships</h3>
                <div className="space-y-2">
                  {relationships.map((rel) => {
                    const sourceTable = tables.find((t) => t.id === rel.source)
                    const targetTable = tables.find((t) => t.id === rel.target)

                    if (!sourceTable || !targetTable) return null

                    return (
                      <div key={rel.id} className="border border-white/10 rounded-md p-3">
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
