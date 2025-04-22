import Link from "next/link"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">AI Schema Builder</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <UserProfileDropdown />
      </div>
    </header>
  )
}
