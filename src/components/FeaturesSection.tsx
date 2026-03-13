import { motion } from "framer-motion";
import { GitBranch, FileCode2, Brain, Shield, Webhook, Layers } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Git-Native Integration",
    description: "Connect any GitHub, GitLab, or Bitbucket repo. AutoDoc watches for pushes and regenerates docs automatically.",
  },
  {
    icon: FileCode2,
    title: "AST Deep Parsing",
    description: "We parse your code into Abstract Syntax Trees — extracting classes, functions, imports, and relationships at the structural level.",
  },
  {
    icon: Brain,
    title: "RAG + LLM Pipeline",
    description: "Retrieval-Augmented Generation ensures your docs are grounded in your actual codebase, not hallucinated.",
  },
  {
    icon: Layers,
    title: "Architecture Diagrams",
    description: "Auto-generate Mermaid.js flowcharts showing module dependencies, class hierarchies, and API call flows.",
  },
  {
    icon: Webhook,
    title: "CI/CD Webhook Sync",
    description: "Trigger doc regeneration on every deploy. Keep documentation perfectly in sync with your production code.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC2 compliant. Private VPC deployment. Your code never leaves your infrastructure.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Built with enterprise-grade
            <br />
            <span className="text-gradient-primary">infrastructure</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every component designed for reliability, security, and scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-xl border border-border bg-card hover:glow-border transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
