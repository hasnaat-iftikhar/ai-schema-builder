"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">AI Schema Builder</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8 lg:hidden">
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <NavMain />
          <NavProjects />
        </div>
        <NavSecondary />
        <div className="mt-auto p-4 border-t">
          <NavUser />
        </div>
      </div>
    </Sidebar>
  )
}
