"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Settings, BarChart } from "lucide-react"

export function NavMain() {
  const pathname = usePathname()

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Overview</h2>
      <div className="space-y-1">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/dashboard/community"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard/community" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Users className="h-4 w-4" />
          <span>Community</span>
        </Link>
        <Link
          href="/dashboard/analytics"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard/analytics" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <BarChart className="h-4 w-4" />
          <span>Analytics</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard/settings" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
}
