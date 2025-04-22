"use client"

import { UserButton } from "@clerk/nextjs"

export function DashboardHeader() {
  return (
    <header className="border-b border-cryptic-border bg-cryptic-card p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <UserButton
          appearance={{
            elements: {
              userButtonBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </header>
  )
}
