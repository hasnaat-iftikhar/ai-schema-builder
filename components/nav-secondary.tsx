import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import type { User } from "@clerk/nextjs/server"

interface NavSecondaryProps {
  user?: User | null
}

export function NavSecondary({ user }: NavSecondaryProps) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">AI Schema Builder</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserProfileDropdown />
        </div>
      </div>
    </div>
  )
}
