import { motion } from "framer-motion";
import { GitBranch, FileCode2, Brain, Shield, Network, Layers, FileText, Code2, Workflow } from "lucide-react";

const features = [
  {
    icon: Network,
    title: "Dependency Graph Builder",
    description: "Automatically maps module dependencies, function call graphs, and service interaction maps across your entire codebase.",
  },
  {
    icon: Brain,
    title: "Architecture Intelligence",
    description: "Detects patterns — Microservices, MVC, Event-Driven, Monolith — and generates system design reports with component maps.",
  },
  {
    icon: FileCode2,
    title: "Deep Code Analysis",
    description: "Parses code into ASTs, extracting classes, functions, imports, relationships, and semantic understanding at the structural level.",
  },
  {
    icon: Layers,
    title: "Architecture Diagrams",
    description: "Auto-generate Mermaid.js flowcharts showing system architecture, class hierarchies, data flows, and API call graphs.",
  },
  {
    icon: FileText,
    title: "Multi-Format Export",
    description: "Export as Markdown, PDF, or HTML documentation sites. Generate READMEs, API docs, onboarding guides, and architecture reports.",
  },
  {
    icon: GitBranch,
    title: "Git-Native Integration",
    description: "Connect any GitHub, GitLab, or Bitbucket repo. Support for GitHub Pages URLs and local file uploads.",
  },
  {
    icon: Code2,
    title: "PR Documentation",
    description: "Auto-generate change summaries, affected module analysis, impact reports, and suggested tests for every pull request.",
  },
  {
    icon: Workflow,
    title: "CI/CD Integration",
    description: "Trigger doc regeneration on every deploy via webhooks. Keep documentation perfectly in sync with production code.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access control, secure authentication, input validation, and rate limiting. Your code is always protected.",
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
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Far beyond
            <br />
            <span className="text-gradient-primary">README generation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deep code understanding, architecture discovery, dependency mapping, and intelligent documentation — all automated.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
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
