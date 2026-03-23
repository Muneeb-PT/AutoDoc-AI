import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
  disabled?: boolean;
}

const languages = [
  "English", "Spanish", "French", "German", "Portuguese", "Hindi",
  "Malayalam", "Arabic", "Chinese", "Japanese", "Korean", "Russian",
  "Italian", "Dutch", "Turkish", "Thai", "Vietnamese",
];

const LanguageSelector = ({ value, onChange, disabled }: LanguageSelectorProps) => {
  return (
    <div className="relative">
      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
      >
        {languages.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
