import { useEffect, useState } from "react";

const lines = [
  { text: "$ autodoc analyze --repo ./my-project", delay: 0, color: "text-primary" },
  { text: "⠋ Cloning repository...", delay: 800, color: "text-muted-foreground" },
  { text: "✓ Repository cloned (47 files)", delay: 1600, color: "text-green-400" },
  { text: "⠋ Running deep code analysis...", delay: 2200, color: "text-muted-foreground" },
  { text: "✓ AST parsed: 23 classes, 142 functions", delay: 3200, color: "text-green-400" },
  { text: "⠋ Building dependency graph...", delay: 3800, color: "text-muted-foreground" },
  { text: "✓ Dependency graph: 12 modules, 47 edges", delay: 4800, color: "text-green-400" },
  { text: "⠋ Detecting architecture patterns...", delay: 5200, color: "text-muted-foreground" },
  { text: "✓ Architecture: Microservice (3 services)", delay: 6000, color: "text-green-400" },
  { text: "⠋ Generating documentation via AI...", delay: 6400, color: "text-muted-foreground" },
  { text: "✓ README.md generated (2,847 words)", delay: 7400, color: "text-green-400" },
  { text: "✓ API reference generated", delay: 7700, color: "text-green-400" },
  { text: "✓ Architecture diagram exported", delay: 8000, color: "text-green-400" },
  { text: "✓ Onboarding guide created", delay: 8300, color: "text-green-400" },
  { text: "", delay: 8600, color: "" },
  { text: "📄 Output saved to ./docs/", delay: 8800, color: "text-primary" },
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
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <div className="w-3 h-3 rounded-full bg-destructive/60" />
        <div className="w-3 h-3 rounded-full bg-accent/60" />
        <div className="w-3 h-3 rounded-full bg-primary/40" />
        <span className="ml-3 text-xs font-mono text-muted-foreground">~/projects/autodoc</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed text-left min-h-[320px]">
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
