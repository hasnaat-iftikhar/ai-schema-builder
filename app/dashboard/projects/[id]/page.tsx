"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiagramEditor } from "@/components/diagram-editor"
import { AIAssistant } from "@/components/ai-assistant"
import { CodeGeneration } from "@/components/code-generation"
import { Documentation } from "@/components/documentation"
import { Download, Share } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

// Mock project data
const getProjectData = (id: string) => {
  const projects = {
    "1": {
      id: "1",
      name: "E-commerce Database",
      description: "Database schema for an online store with products, orders, and users.",
      tables: [
        {
          id: "t1",
          name: "Users",
          x: 50,
          y: 50,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "email", type: "varchar", isUnique: true },
            { name: "password", type: "varchar" },
            { name: "name", type: "varchar" },
            { name: "created_at", type: "timestamp" },
          ],
        },
        {
          id: "t2",
          name: "Products",
          x: 350,
          y: 50,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "name", type: "varchar" },
            { name: "description", type: "text" },
            { name: "price", type: "decimal" },
            { name: "stock", type: "integer" },
            { name: "category_id", type: "uuid", isForeign: true },
          ],
        },
        {
          id: "t3",
          name: "Orders",
          x: 200,
          y: 300,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "user_id", type: "uuid", isForeign: true },
            { name: "status", type: "varchar" },
            { name: "total", type: "decimal" },
            { name: "created_at", type: "timestamp" },
          ],
        },
      ],
      relationships: [
        { id: "r1", source: "t1", target: "t3", sourceKey: "id", targetKey: "user_id" },
        { id: "r2", source: "t2", target: "t3", sourceKey: "id", targetKey: "product_id", through: "order_items" },
      ],
    },
    "2": {
      id: "2",
      name: "Blog Platform",
      description: "Schema for a blog with posts, comments, and user authentication.",
      tables: [
        {
          id: "t1",
          name: "Users",
          x: 50,
          y: 50,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "email", type: "varchar", isUnique: true },
            { name: "password", type: "varchar" },
            { name: "name", type: "varchar" },
            { name: "created_at", type: "timestamp" },
          ],
        },
        {
          id: "t2",
          name: "Posts",
          x: 350,
          y: 50,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "title", type: "varchar" },
            { name: "content", type: "text" },
            { name: "user_id", type: "uuid", isForeign: true },
            { name: "published_at", type: "timestamp" },
          ],
        },
        {
          id: "t3",
          name: "Comments",
          x: 200,
          y: 300,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "post_id", type: "uuid", isForeign: true },
            { name: "user_id", type: "uuid", isForeign: true },
            { name: "content", type: "text" },
            { name: "created_at", type: "timestamp" },
          ],
        },
      ],
      relationships: [
        { id: "r1", source: "t1", target: "t2", sourceKey: "id", targetKey: "user_id" },
        { id: "r2", source: "t1", target: "t3", sourceKey: "id", targetKey: "user_id" },
        { id: "r3", source: "t2", target: "t3", sourceKey: "id", targetKey: "post_id" },
      ],
    },
    "3": {
      id: "3",
      name: "Task Management App",
      description: "Project management system with tasks, projects, and team members.",
      tables: [
        {
          id: "t1",
          name: "Users",
          x: 50,
          y: 50,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "email", type: "varchar", isUnique: true },
            { name: "password", type: "varchar" },
            { name: "name", type: "varchar" },
            { name: "created_at", type: "timestamp" },
          ],
        },
        {
          id: "t2",
          name: "Projects",
          x: 350,
          y: 50,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "name", type: "varchar" },
            { name: "description", type: "text" },
            { name: "owner_id", type: "uuid", isForeign: true },
            { name: "created_at", type: "timestamp" },
          ],
        },
        {
          id: "t3",
          name: "Tasks",
          x: 200,
          y: 300,
          columns: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "title", type: "varchar" },
            { name: "description", type: "text" },
            { name: "status", type: "varchar" },
            { name: "project_id", type: "uuid", isForeign: true },
            { name: "assignee_id", type: "uuid", isForeign: true },
            { name: "due_date", type: "timestamp" },
          ],
        },
      ],
      relationships: [
        { id: "r1", source: "t1", target: "t2", sourceKey: "id", targetKey: "owner_id" },
        { id: "r2", source: "t2", target: "t3", sourceKey: "id", targetKey: "project_id" },
        { id: "r3", source: "t1", target: "t3", sourceKey: "id", targetKey: "assignee_id" },
      ],
    },
  }

  return projects[id as keyof typeof projects]
}

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const project = getProjectData(projectId)
  const [activeTab, setActiveTab] = useState("diagram")

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="gap-2">
            <Share className="h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diagram">Diagram</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          <TabsTrigger value="code">Code Generation</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>
        <TabsContent value="diagram" className="space-y-4">
          <DiagramEditor project={project} />
        </TabsContent>
        <TabsContent value="ai" className="space-y-4">
          <AIAssistant project={project} />
        </TabsContent>
        <TabsContent value="code" className="space-y-4">
          <CodeGeneration project={project} />
        </TabsContent>
        <TabsContent value="docs" className="space-y-4">
          <Documentation project={project} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
