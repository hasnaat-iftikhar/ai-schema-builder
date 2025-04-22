import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "FREE",
      description: "Perfect for individuals or small teams getting started with analytics.",
      features: ["Basic performance metrics", "Insights for one platform", "Limited report downloads"],
      cta: "Get Started for Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Designed for growing businesses with advanced needs.",
      features: ["Custom dashboards and reports", "Multi-platform analytics", "Real-time trend alerts"],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored for large enterprises with complex requirements.",
      features: [
        "Unlimited platforms and users",
        "Integrated AI recommendations",
        "Dedicated account manager",
        "Full team collaboration tools",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.name} className={`pricing-card ${plan.popular ? "border-primary/30 shadow-lg" : ""}`}>
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-black">
              Popular
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-sm text-white/70">{plan.period}</span>}
            </div>
            <p className="mt-2 text-sm text-white/70">{plan.description}</p>
          </div>

          <div className="mb-6 space-y-2">
            {plan.features.map((feature) => (
              <div key={feature} className="pricing-feature">
                <Check className="h-4 w-4 pricing-check" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
            {plan.cta}
          </Button>
        </div>
      ))}
    </div>
  )
}
