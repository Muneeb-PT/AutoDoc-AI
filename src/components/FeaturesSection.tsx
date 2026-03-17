import { motion } from "framer-motion";
import {
  GitBranch, FileCode2, Brain, Shield, Network, Layers,
  FileText, Code2, Workflow, Sparkles, MessageSquareCode,
  Palette, Zap, Globe, History,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Architecture Intelligence",
    description: "Detects Microservices, MVC, Event-Driven, Monolith patterns and generates full system design reports with component maps.",
    badge: "Unique",
  },
  {
    icon: Network,
    title: "Dependency Graph Builder",
    description: "Maps module dependencies, function call graphs, and service interaction diagrams across your entire codebase automatically.",
    badge: null,
  },
  {
    icon: MessageSquareCode,
    title: "Code Q&A Chat",
    description: "Ask questions about any part of your codebase. AI answers with context-aware explanations and references to specific files.",
    badge: "Pro",
  },
  {
    icon: Layers,
    title: "Architecture Diagrams",
    description: "Auto-generate Mermaid.js diagrams — system architecture, class hierarchies, data flows, and API call graphs — rendered live.",
    badge: null,
  },
  {
    icon: Palette,
    title: "6 Professional Templates",
    description: "Export docs in Minimal, Startup Bold, Enterprise Pro, Open Source, API Reference, or Developer Onboarding styles.",
    badge: "Unique",
  },
  {
    icon: FileCode2,
    title: "Deep Code Analysis",
    description: "Parses code into ASTs, extracting classes, functions, imports, relationships, and semantic understanding at structural level.",
    badge: null,
  },
  {
    icon: Sparkles,
    title: "Smart Doc Versioning",
    description: "Track how your documentation evolves. Compare versions side-by-side and see what changed between analyses.",
    badge: "Pro",
  },
  {
    icon: Code2,
    title: "PR Documentation",
    description: "Auto-generate change summaries, affected module analysis, impact reports, and suggested tests for every pull request.",
    badge: "Pro",
  },
  {
    icon: Globe,
    title: "Doc Website Generator",
    description: "Generate a complete hosted documentation site from your codebase — deployable to GitHub Pages, Vercel, or Netlify.",
    badge: "Coming Soon",
  },
  {
    icon: FileText,
    title: "Multi-Format Export",
    description: "Export as Markdown, styled HTML, or print-ready PDF. Download full READMEs, API docs, and onboarding guides.",
    badge: null,
  },
  {
    icon: Zap,
    title: "Instant Re-analysis",
    description: "One-click re-analyze after code changes. Cached results mean lightning-fast regeneration for unchanged modules.",
    badge: null,
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access, secure auth, input validation, rate limiting, and sandboxed file analysis. Your code stays safe.",
    badge: null,
  },
];

const badgeColors: Record<string, string> = {
  Unique: "bg-primary/10 text-primary border-primary/20",
  Pro: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Coming Soon": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

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
            What competitors
            <br />
            <span className="text-gradient-primary">don't offer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Architecture intelligence, code Q&A, template exports, and diagram generation — features you won't find in GitBook or Mintlify.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative p-6 rounded-xl border border-border bg-card hover:glow-border transition-all duration-300"
            >
              {feature.badge && (
                <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColors[feature.badge]}`}>
                  {feature.badge}
                </span>
              )}
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
