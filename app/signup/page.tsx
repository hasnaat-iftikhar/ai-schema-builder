import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
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
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-cryptic-block lg:flex items-center justify-center">
        <div className="p-8 w-full max-w-md">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
                <span className="text-white/70 text-sm">Entity</span>
              </div>
              <div className="h-20 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
                <span className="text-white/70 text-sm">Entity</span>
              </div>
              <div className="h-20 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
                <span className="text-white/70 text-sm">Entity</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-8 w-1/2 border-t-2 border-l-2 border-r-2 border-dashed border-white/30"></div>
            </div>
            <div className="h-40 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
              <span className="text-white/70 text-sm">Database Diagram</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
                <span className="text-white/70 text-sm">Relationship</span>
              </div>
              <div className="h-24 border-2 border-dashed border-white/30 rounded-md flex items-center justify-center">
                <span className="text-white/70 text-sm">Relationship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
