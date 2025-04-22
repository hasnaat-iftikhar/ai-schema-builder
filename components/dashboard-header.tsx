import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export function DashboardHeader() {
  return (
    <div className="border-b border-white/10">
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
