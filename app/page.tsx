import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        <header>
          <div className="container flex h-24 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cryptic-accent text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <span className="text-xl font-bold">AI Schema Builder</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="https://github.com">
                <Button variant="github" size="header" className="gap-2">
                  <GithubIcon className="h-5 w-5" />
                  GitHub
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="header">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container py-24">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Build Database Schemas <br className="hidden sm:inline" />
              with AI Assistance
            </h1>
            <p className="mt-6 text-base leading-[140%] text-white/70 max-w-[480px]">
              Design and visualize database schemas effortlessly using AI. Generate optimized code, create
              relationships, and streamline your development workflow—all in one intuitive platform.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-24 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-cryptic-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cryptic-accent/20 text-cryptic-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="m9 15 3 3 3-3" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold">Visual Schema Design</h3>
              <p className="mt-2 text-sm text-white/70">
                Drag and drop interface for creating database tables and relationships with ease.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-cryptic-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cryptic-accent/20 text-cryptic-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold">AI Assistant</h3>
              <p className="mt-2 text-sm text-white/70">
                Get intelligent suggestions and optimizations for your database schema using natural language.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-cryptic-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cryptic-accent/20 text-cryptic-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="m18 16 4-4-4-4" />
                  <path d="m6 8-4 4 4 4" />
                  <path d="m14.5 4-5 16" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold">Code Generation</h3>
              <p className="mt-2 text-sm text-white/70">
                Generate database code for multiple platforms including Prisma, SQL, and TypeScript.
              </p>
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10 py-8">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/50">© 2025 AI Schema Builder. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-white/50 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-sm text-white/50 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-white/50 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
