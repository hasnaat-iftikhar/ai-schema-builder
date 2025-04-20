"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, Share2, Users } from "lucide-react"
import { useState } from "react"

interface Project {
  id: string
  name: string
  description: string
}

interface SharingProps {
  project: Project
}

export function Sharing({ project }: SharingProps) {
  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `https://aischemabuilder.com/projects/${project.id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Share Project</CardTitle>
          <CardDescription>Share your schema with others or publish to the community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-url">Project URL</Label>
            <div className="flex gap-2">
              <Input id="share-url" value={shareUrl} readOnly className="flex-1" />
              <Button variant="outline" onClick={handleCopy}>
                {copied ? "Copied!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Publish to Community</Label>
                <p className="text-sm text-muted-foreground">Make your project visible to all users</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {isPublic && (
              <div className="rounded-md border p-4 bg-muted/50">
                <div className="flex items-start gap-4">
                  <Users className="h-10 w-10 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Community Visibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Your project will be visible to all users in the community section. They can view and clone your
                      schema, but cannot modify it.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button className="gap-2">
            <Share2 className="h-4 w-4" /> Share Project
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
