import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For individual developers exploring AutoDoc.",
    features: [
      "Public repositories only",
      "Basic README generation",
      "5 analyses / month",
      "Community support",
      "Watermark on exports",
    ],
    cta: "Get Started",
    href: "/auth",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/mo",
    description: "For teams shipping fast and documenting everything.",
    features: [
      "Unlimited private repos",
      "Full architecture analysis",
      "Dependency graph generation",
      "API documentation",
      "PDF & HTML export",
      "PR documentation",
      "Mermaid diagram export",
      "Priority support",
      "No watermark",
    ],
    cta: "Upgrade to Pro",
    href: "/payment",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with compliance and scale needs.",
    features: [
      "Everything in Pro",
      "Custom documentation templates",
      "CI/CD webhook integration",
      "Team management & SSO",
      "Custom AI model fine-tuning",
      "Dedicated success manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "mailto:mohammedmuneebptcsa@gmail.com",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Simple, transparent <span className="text-gradient-primary">pricing</span>
          </h2>
          <p className="text-muted-foreground">Start free. Upgrade when you need full codebase intelligence.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-xl p-8 border flex flex-col ${
                plan.highlighted
                  ? "border-primary/50 bg-card glow-border"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <Check size={16} className="text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all text-center block ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90 glow-primary"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
