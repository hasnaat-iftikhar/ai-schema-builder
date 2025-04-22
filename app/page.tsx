import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnimatedBackground from "@/components/animated-background"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatedBackground />

      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-white font-bold text-xl">AI Schema Builder</div>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-black hover:bg-gray-200">Sign Up</Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Build Database Schemas with AI Assistance
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Design, visualize, and generate database schemas effortlessly with our AI-powered platform. Save time and
              eliminate errors in your database design process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black px-8"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-24" id="features">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Powerful Features for Database Design</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-white mb-4 text-2xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Database Design Process?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of developers who are building better database schemas faster with AI assistance.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8">
                Start Building Now
              </Button>
            </Link>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-12 text-center text-gray-500 border-t border-gray-800">
          <p>© 2023 AI Schema Builder. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

const features = [
  {
    icon: "🧠",
    title: "AI-Powered Suggestions",
    description:
      "Get intelligent suggestions for tables, columns, relationships, and optimizations based on your project requirements.",
  },
  {
    icon: "📊",
    title: "Visual Schema Editor",
    description: "Drag-and-drop interface for creating and modifying database schemas with real-time visualization.",
  },
  {
    icon: "🔄",
    title: "Automatic Relationships",
    description:
      "AI automatically detects and suggests relationships between tables based on naming conventions and data types.",
  },
  {
    icon: "📝",
    title: "Code Generation",
    description: "Generate SQL, Prisma, TypeORM, or Mongoose code from your schema with a single click.",
  },
  {
    icon: "📚",
    title: "Schema Documentation",
    description: "Automatically generate comprehensive documentation for your database schema.",
  },
  {
    icon: "🔄",
    title: "Version Control",
    description: "Track changes to your schema over time and collaborate with team members.",
  },
]
