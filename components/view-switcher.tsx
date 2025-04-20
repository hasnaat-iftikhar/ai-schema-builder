"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ViewSwitcherProps {
  activeView: "diagram" | "code"
  onViewChange: (view: "diagram" | "code") => void
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <Tabs value={activeView} onValueChange={(value) => onViewChange(value as "diagram" | "code")}>
      <TabsList className="grid grid-cols-2 w-[200px]">
        <TabsTrigger value="diagram">Diagram</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
