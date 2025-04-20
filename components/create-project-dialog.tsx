"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export function CreateProjectDialog({ fullWidth = false }: { fullWidth?: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!projectName.trim()) return

    setIsSubmitting(true)

    // Here you would handle the project creation
    console.log("Creating project:", { projectName, projectDescription })

    // Close the dialog
    setOpen(false)

    // Navigate to the project creation screen
    // You can pass the project details as query parameters or use another state management solution
    router.push(
      `/dashboard/projects/new?name=${encodeURIComponent(projectName)}&description=${encodeURIComponent(projectDescription)}`,
    )

    // Reset form (though not strictly necessary since we're navigating away)
    setProjectName("")
    setProjectDescription("")
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 bg-cryptic-accent text-black hover:bg-cryptic-accent/90 border-none ${fullWidth ? "w-full" : ""}`}
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-cryptic-card border-white/10">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new database schema project. Give it a name and optional description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-cryptic-background border-white/10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="projectDescription">Project Description (Optional)</Label>
            <Textarea
              id="projectDescription"
              placeholder="Enter project description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="resize-none bg-cryptic-background border-white/10"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!projectName.trim() || isSubmitting}
            className="bg-cryptic-accent text-black hover:bg-cryptic-accent/90"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
