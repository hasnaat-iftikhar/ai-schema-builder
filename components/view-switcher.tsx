"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"

interface ViewSwitcherProps {
  activeView: "diagram" | "code"
  onViewChange: (view: "diagram" | "code") => void
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  useEffect(() => {
    // When switching to code view, ensure code is generated
    if (activeView === "code" && onViewChange) {
      // Force a re-render of the code view
      const currentView = activeView
      onViewChange("diagram")
      setTimeout(() => onViewChange(currentView), 0)
    }
  }, [activeView, onViewChange])

  return (
    <Tabs value={activeView} onValueChange={(value) => onViewChange(value as "diagram" | "code")}>
      <TabsList className="grid grid-cols-2 w-[200px]">
        <TabsTrigger value="diagram">Diagram</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
