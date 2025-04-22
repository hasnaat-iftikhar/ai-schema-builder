import { ArrowRight, BarChart3, LineChart, Settings } from "lucide-react"

export function ProcessSteps() {
  const steps = [
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Connect Your Accounts",
      description: "Sync seamlessly with Instagram, Facebook, Twitter, and more in seconds.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Track Your Metrics",
      description: "Gain instant access to detailed analytics across platforms.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Optimize Performance",
      description: "Turn insights into action with AI-powered recommendations.",
    },
  ]

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          <div className="feature-card h-full">
            <div className="feature-icon">{step.icon}</div>
            <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
            <p className="text-sm text-white/70">{step.description}</p>
          </div>

          {index < steps.length - 1 && (
            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-white/30 md:block">
              <ArrowRight className="h-6 w-6" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
