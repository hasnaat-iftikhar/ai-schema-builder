import { Check, X } from "lucide-react"

export function FeatureComparison() {
  const features = [
    {
      name: "Price",
      starter: "Free",
      pro: "$29/month",
    },
    {
      name: "Platforms Supported",
      starter: "1 Platform",
      pro: "Multi-Platform",
    },
    {
      name: "Analytics Depth",
      starter: "Basic Metrics",
      pro: "Advanced Metrics",
    },
    {
      name: "Real-Time Updates",
      starter: false,
      pro: true,
    },
    {
      name: "Custom Dashboards",
      starter: false,
      pro: true,
    },
    {
      name: "Report Downloads",
      starter: "Limited",
      pro: "Unlimited",
    },
    {
      name: "Audience Insights",
      starter: false,
      pro: true,
    },
    {
      name: "Competitive Benchmarking",
      starter: false,
      pro: true,
    },
    {
      name: "Support",
      starter: "Standard Support",
      pro: "Priority Support",
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 text-left font-medium">Feature</th>
            <th className="py-4 text-center font-medium">Starter</th>
            <th className="py-4 text-center font-medium">Pro</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.name} className="border-b border-white/5">
              <td className="py-4 text-sm">{feature.name}</td>
              <td className="py-4 text-center">
                {typeof feature.starter === "boolean" ? (
                  feature.starter ? (
                    <Check className="mx-auto h-4 w-4 text-primary" />
                  ) : (
                    <X className="mx-auto h-4 w-4 text-white/30" />
                  )
                ) : (
                  <span className="text-sm">{feature.starter}</span>
                )}
              </td>
              <td className="py-4 text-center">
                {typeof feature.pro === "boolean" ? (
                  feature.pro ? (
                    <Check className="mx-auto h-4 w-4 text-primary" />
                  ) : (
                    <X className="mx-auto h-4 w-4 text-white/30" />
                  )
                ) : (
                  <span className="text-sm">{feature.pro}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
