import { motion } from "framer-motion";
import { FileCode2, Layers, GitBranch, Clock } from "lucide-react";

interface DocStatsBarProps {
  content: string;
}

const DocStatsBar = ({ content }: DocStatsBarProps) => {
  const lines = content.split("\n").length;
  const words = content.split(/\s+/).filter(Boolean).length;
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const stats = [
    { icon: FileCode2, label: "Lines", value: lines.toLocaleString() },
    { icon: Layers, label: "Sections", value: headings },
    { icon: GitBranch, label: "Code Blocks", value: Math.floor(codeBlocks) },
    { icon: Clock, label: "Read Time", value: `${readingTime}m` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"
    >
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card">
          <s.icon size={16} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-sm font-bold text-foreground">{s.value}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default DocStatsBar;
