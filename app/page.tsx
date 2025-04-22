import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animated-background"
import { SocialPlatforms } from "@/components/social-platforms"
import { ProcessSteps } from "@/components/process-steps"
import { PricingSection } from "@/components/pricing-section"
import { FeaturesSection } from "@/components/features-section"
import { FeatureComparison } from "@/components/feature-comparison"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Navigation */}
        <header className="border-b border-white/10">
          <div className="container flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <span className="text-xl font-bold">AI Schema Builder</span>
            </div>

            <nav className="hidden md:block">
              <ul className="flex gap-8">
                <li>
                  <Link href="#features" className="text-sm text-white/70 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#solution" className="text-sm text-white/70 hover:text-white">
                    Solution
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-white/70 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-sm text-white/70 hover:text-white">
                    About
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Track Everything in One Place
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                Stay ahead of the competition with real-time analytics and actionable insights tailored to grow your
                social media presence.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-16 flex justify-center">
              <div className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-card p-2 shadow-xl dashboard-glow">
                <Image
                  src="/dashboard-preview.png"
                  alt="Dashboard Preview"
                  width={1200}
                  height={675}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Platforms */}
        <section className="border-t border-white/10 py-12">
          <div className="container">
            <SocialPlatforms />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Powerful Features to Elevate Your Social Media Performance
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Stay ahead of the competition with real-time analytics and actionable insights tailored to grow your
                social media presence.
              </p>
            </div>

            <FeaturesSection />
          </div>
        </section>

        {/* Process Section */}
        <section id="solution" className="gradient-bg py-20">
          <div className="container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Learn More About Process</h2>
              <p className="mt-4 text-lg text-white/70">
                Unveil the simple steps to connect, empowering your social media strategy like never before.
              </p>
            </div>

            <ProcessSteps />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Simple Pricing for Every Need
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Choose a plan that fits your goals and scale your social media performance with ease.
              </p>
            </div>

            <PricingSection />

            <div className="mt-20">
              <div className="mx-auto mb-8 max-w-3xl text-center">
                <h3 className="font-display text-2xl font-bold">Compare our plans</h3>
                <p className="mt-2 text-white/70">
                  Find the perfect plan for your social media needs and see what fits your goals best.
                </p>
              </div>

              <FeatureComparison />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M7 7h10" />
                      <path d="M7 12h10" />
                      <path d="M7 17h10" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">AI Schema Builder</span>
                </div>
                <p className="mt-4 text-sm text-white/70">
                  Design and visualize database schemas effortlessly using AI. Generate optimized code, create
                  relationships, and streamline your development workflow.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-bold">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Integrations
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-bold">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-bold">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
              <p className="text-sm text-white/50">© 2025 AI Schema Builder. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-white/50 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link href="#" className="text-white/50 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
                <Link href="#" className="text-white/50 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
