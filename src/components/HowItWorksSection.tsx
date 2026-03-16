import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Repository Ingestion", desc: "Connect your GitHub repo, paste any URL, or upload local files. We securely index your entire codebase." },
  { num: "02", title: "Deep Code Analysis", desc: "Static analysis extracts classes, functions, imports, dependencies, and architecture patterns." },
  { num: "03", title: "Architecture Discovery", desc: "AI detects system patterns — Microservices, MVC, Event-Driven — and maps service boundaries and data flows." },
  { num: "04", title: "Context Building", desc: "Intelligent context retrieval ensures documentation is grounded in your actual codebase, not hallucinated." },
  { num: "05", title: "Documentation Generation", desc: "AI generates README, API reference, architecture reports, onboarding guides, and Mermaid diagrams." },
  { num: "06", title: "Export & Deploy", desc: "Download as Markdown, PDF, or generate a full documentation website. Auto-sync on every push." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Pipeline</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            How AutoDoc AI <span className="text-gradient-primary">Works</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 relative z-10">
                  <span className="font-mono font-bold text-sm text-primary">{step.num}</span>
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-xl text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
