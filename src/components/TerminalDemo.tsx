import { useEffect, useState } from "react";

const lines = [
  { text: "$ autodoc analyze --repo ./my-project", delay: 0, color: "text-primary" },
  { text: "⠋ Cloning repository...", delay: 800, color: "text-muted-foreground" },
  { text: "✓ Repository cloned successfully", delay: 1600, color: "text-green-400" },
  { text: "⠋ Building AST from 47 files...", delay: 2200, color: "text-muted-foreground" },
  { text: "✓ AST parsed: 23 classes, 142 functions", delay: 3200, color: "text-green-400" },
  { text: "⠋ Generating vector embeddings...", delay: 3800, color: "text-muted-foreground" },
  { text: "✓ Embeddings stored in vector DB", delay: 4800, color: "text-green-400" },
  { text: "⠋ Running RAG + LLM pipeline...", delay: 5400, color: "text-muted-foreground" },
  { text: "✓ README.md generated (2,847 words)", delay: 6800, color: "text-green-400" },
  { text: "✓ API Reference generated", delay: 7200, color: "text-green-400" },
  { text: "✓ Architecture diagram exported", delay: 7600, color: "text-green-400" },
  { text: "", delay: 8000, color: "" },
  { text: "📄 Output saved to ./docs/", delay: 8200, color: "text-primary" },
];

const TerminalDemo = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    lines.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card overflow-hidden glow-border">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <div className="w-3 h-3 rounded-full bg-destructive/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-3 text-xs font-mono text-muted-foreground">~/projects/autodoc</span>
      </div>
      {/* Content */}
      <div className="p-5 font-mono text-sm leading-relaxed text-left min-h-[280px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`${line.color} ${i === visibleLines - 1 ? "animate-fade-in" : ""}`}>
            {line.text}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-primary animate-terminal-cursor ml-0.5" />
        )}
      </div>
    </div>
  );
};

export default TerminalDemo;
