import { BarChart3, LineChart, PieChart, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Comprehensive Analytics",
      description: "Monitor your performance across all platforms with intuitive visualizations and detailed reports.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Audience Insights",
      description: "Understand your audience's behavior and demographics to create more engaging content.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Competitive Benchmarking",
      description: "Compare your metrics against competitors and identify opportunities for growth.",
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Customizable Dashboards",
      description: "Tailor your dashboard to display the metrics and KPIs that matter most to your strategy.",
    },
  ]

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <div key={index} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
          <p className="text-sm text-white/70">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
