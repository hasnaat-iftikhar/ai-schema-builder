import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cryptic-accent text-black">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-white">AI Schema Builder</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-cryptic-block lg:flex items-center justify-center">
        <div className="p-8 w-full max-w-md">
          <div className="space-y-6">
            <div className="h-16 w-full border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
              <span className="text-white/70 text-sm">Header</span>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-white/20 rounded-md"></div>
              <div className="h-4 w-full bg-white/20 rounded-md"></div>
              <div className="h-4 w-5/6 bg-white/20 rounded-md"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
                <span className="text-white/70 text-sm">Table</span>
              </div>
              <div className="h-24 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
                <span className="text-white/70 text-sm">Table</span>
              </div>
            </div>
            <div className="h-40 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
              <span className="text-white/70 text-sm">Schema Diagram</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
