"use client"

import { UserButton } from "@clerk/nextjs"

export function UserProfileDropdown() {
  return (
    <div className="flex items-center gap-2">
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "h-8 w-8",
          },
        }}
      />
    </div>
  )
}
