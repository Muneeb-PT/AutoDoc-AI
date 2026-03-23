import { FileText, User, BarChart3, Briefcase, Code2 } from "lucide-react";

export type DocType = "readme" | "resume" | "report" | "proposal" | "api-docs";

interface DocumentTypeSelectorProps {
  value: DocType;
  onChange: (type: DocType) => void;
  disabled?: boolean;
}

const docTypes = [
  { id: "readme" as DocType, label: "README", icon: FileText, desc: "Technical documentation" },
  { id: "resume" as DocType, label: "Resume", icon: User, desc: "Professional CV" },
  { id: "report" as DocType, label: "Report", icon: BarChart3, desc: "Business report" },
  { id: "proposal" as DocType, label: "Proposal", icon: Briefcase, desc: "Business proposal" },
  { id: "api-docs" as DocType, label: "API Docs", icon: Code2, desc: "API reference" },
];

const DocumentTypeSelector = ({ value, onChange, disabled }: DocumentTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {docTypes.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          disabled={disabled}
          className={`p-3 rounded-xl border text-center transition-all ${
            value === t.id
              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
              : "border-border text-foreground hover:border-primary/30 hover:bg-secondary/30"
          } disabled:opacity-50`}
        >
          <t.icon size={20} className="mx-auto mb-1.5" />
          <div className="text-sm font-semibold">{t.label}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</div>
        </button>
      ))}
    </div>
  );
};

export default DocumentTypeSelector;
