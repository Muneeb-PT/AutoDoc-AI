import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Repo Ingestion", desc: "Connect your GitHub repo. We clone and index your entire codebase securely.", color: "text-primary" },
  { num: "02", title: "AST Parsing", desc: "Deep static analysis extracts classes, functions, imports, and their relationships.", color: "text-primary" },
  { num: "03", title: "Vector Embeddings", desc: "Code metadata is embedded into a vector database for semantic search.", color: "text-primary" },
  { num: "04", title: "RAG + LLM", desc: "Retrieval-Augmented Generation produces accurate, context-aware documentation.", color: "text-primary" },
  { num: "05", title: "Docs Output", desc: "README, API reference, and Mermaid architecture diagrams — ready to ship.", color: "text-primary" },
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
          {/* Vertical line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
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
