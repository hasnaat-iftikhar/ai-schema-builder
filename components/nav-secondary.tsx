"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { HelpCircle, FileText } from "lucide-react"

export function NavSecondary() {
  const pathname = usePathname()

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Support</h2>
      <div className="space-y-1">
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard/docs" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Documentation</span>
        </Link>
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard/help" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help & Support</span>
        </Link>
      </div>
    </div>
  )
}
