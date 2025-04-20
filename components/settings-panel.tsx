"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SettingsPanelProps {
  projectName: string
  projectDescription: string
  onUpdate: (name: string, description: string) => void
}

export function SettingsPanel({ projectName, projectDescription, onUpdate }: SettingsPanelProps) {
  const [name, setName] = useState(projectName)
  const [description, setDescription] = useState(projectDescription)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      onUpdate(name, description)
      setIsSaving(false)
    }, 500)
  }

  return (
    <div className="w-full h-full overflow-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>Edit your project details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-cryptic-background border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Project Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="bg-cryptic-background border-white/10 resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="bg-cryptic-accent text-black hover:bg-cryptic-accent/90"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
