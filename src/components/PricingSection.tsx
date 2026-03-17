import { motion } from "framer-motion";
import { Check, X, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For individual developers exploring AutoDoc.",
    features: [
      { text: "Public repositories only", included: true },
      { text: "5 analyses / month", included: true },
      { text: "Markdown export", included: true },
      { text: "Minimal & Open Source templates", included: true },
      { text: "Community support", included: true },
      { text: "Watermark on exports", included: true },
      { text: "Architecture diagrams", included: false },
      { text: "Code Q&A chat", included: false },
      { text: "Pro templates", included: false },
    ],
    cta: "Get Started Free",
    href: "/auth",
    highlighted: false,
    badge: null,
    icon: null,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/mo",
    description: "For teams shipping fast and documenting everything.",
    features: [
      { text: "Unlimited private repos", included: true },
      { text: "Unlimited analyses", included: true },
      { text: "All 6 professional templates", included: true },
      { text: "Architecture intelligence", included: true },
      { text: "Mermaid diagram generation", included: true },
      { text: "Code Q&A chat", included: true },
      { text: "PR documentation", included: true },
      { text: "Doc versioning & history", included: true },
      { text: "PDF + HTML + Markdown export", included: true },
      { text: "No watermark", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Upgrade to Pro",
    href: "/payment",
    highlighted: true,
    badge: "MOST POPULAR",
    icon: Zap,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For orgs with compliance, scale, and custom needs.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Custom branded templates", included: true },
      { text: "CI/CD webhook integration", included: true },
      { text: "Doc website generator", included: true },
      { text: "Team management & SSO", included: true },
      { text: "Custom AI model fine-tuning", included: true },
      { text: "Dedicated success manager", included: true },
      { text: "SLA guarantee", included: true },
      { text: "On-premise deployment", included: true },
    ],
    cta: "Contact Sales",
    href: "mailto:mohammedmuneebptcsa@gmail.com",
    highlighted: false,
    badge: null,
    icon: Crown,
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
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-2">
                {plan.icon && <plan.icon size={18} className="text-primary" />}
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              </div>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.text} className={`flex items-center gap-3 text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/50 line-through"}`}>
                    {feature.included ? (
                      <Check size={16} className="text-primary shrink-0" />
                    ) : (
                      <X size={16} className="shrink-0" />
                    )}
                    {feature.text}
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

        {/* Comparison note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          All plans include secure auth, encrypted analysis, and GDPR compliance. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
