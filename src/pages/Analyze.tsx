import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, Loader2, Github, CheckCircle2, AlertCircle, Upload, FolderOpen, LogOut, Eye, Code } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type JobStatus = "idle" | "processing" | "completed" | "failed";
type InputMode = "url" | "file";
type ViewMode = "preview" | "raw";

const progressSteps = [
  "Connecting to repository...",
  "Scanning files & structure...",
  "Building dependency graph...",
  "Analyzing code patterns...",
  "Detecting architecture...",
  "Generating documentation via AI...",
];

const AnalyzePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [files, setFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (status !== "processing") return;
    setProgressIndex(0);
    const interval = setInterval(() => {
      setProgressIndex((prev) => (prev < progressSteps.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, [status]);

  const readFilesContent = async (fileList: File[]): Promise<string> => {
    const contents: string[] = [];
    for (const file of fileList) {
      try {
        const text = await file.text();
        contents.push(`--- FILE: ${file.webkitRelativePath || file.name} ---\n${text}`);
      } catch {
        contents.push(`--- FILE: ${file.webkitRelativePath || file.name} --- [binary file, skipped]`);
      }
    }
    return contents.join("\n\n");
  };

  const handleAnalyze = async () => {
    if (inputMode === "url" && !repoUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }
    if (inputMode === "file" && files.length === 0) {
      toast.error("Please select files to analyze");
      return;
    }

    setStatus("processing");
    setResult("");
    setError("");

    try {
      let body: Record<string, string> = {};
      if (inputMode === "url") {
        body = { repo_url: repoUrl.trim() };
      } else {
        const fileContent = await readFilesContent(files);
        body = { file_content: fileContent, project_name: files[0]?.webkitRelativePath?.split("/")[0] || "Project" };
      }

      const { data, error: fnError } = await supabase.functions.invoke("analyze-repo", { body });

      if (fnError) throw new Error(fnError.message || "Analysis failed");
      if (data?.error) throw new Error(data.error);

      setResult(data.result);
      setStatus("completed");
      toast.success("Documentation generated successfully!");
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
      setStatus("failed");
      toast.error(e.message || "Analysis failed");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (format: "md" | "html") => {
    if (format === "md") {
      const blob = new Blob([result], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "README.md";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("README.md downloaded!");
    } else {
      const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Documentation</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:2rem;line-height:1.6;color:#e2e8f0;background:#0a0e1a}a{color:#22d3ee}pre{background:#1e293b;padding:1rem;border-radius:8px;overflow-x:auto}code{background:#1e293b;padding:2px 6px;border-radius:4px}h1,h2,h3{color:#f1f5f9}</style></head><body><pre>${result.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documentation.html";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("HTML documentation downloaded!");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="AutoDoc AI" className="w-8 h-8" />
            <span className="font-bold text-foreground">
              AutoDoc <span className="text-primary">AI</span>
            </span>
          </div>
          <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Generate <span className="text-gradient-primary">Documentation</span>
          </h1>
          <p className="text-muted-foreground">Paste a URL or upload local files to generate comprehensive docs.</p>
        </motion.div>

        {/* Input Mode Toggle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setInputMode("url")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              inputMode === "url" ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            <Github size={16} /> Repository URL
          </button>
          <button
            onClick={() => setInputMode("file")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              inputMode === "file" ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            <FolderOpen size={16} /> Local Files
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
          {inputMode === "url" ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo or any URL"
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                  disabled={status === "processing"}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <button onClick={handleAnalyze} disabled={status === "processing"} className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-primary">
                {status === "processing" ? (<><Loader2 size={18} className="animate-spin" />Analyzing...</>) : "Generate Docs"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
                <Upload size={32} className="text-muted-foreground mb-3" />
                <span className="text-sm text-muted-foreground">Click to select a folder or files</span>
                <span className="text-xs text-muted-foreground mt-1">Supports project folders with source code</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileSelect}
                  disabled={status === "processing"}
                  {...({ webkitdirectory: "", directory: "" } as any)}
                />
              </label>
              {files.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{files.length} files selected</p>
                  <button onClick={handleAnalyze} disabled={status === "processing"} className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 glow-primary">
                    {status === "processing" ? (<><Loader2 size={18} className="animate-spin" />Analyzing...</>) : "Generate Docs"}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Processing with progress steps */}
        {status === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-8">
            <div className="text-center mb-6">
              <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground font-semibold">Analyzing {inputMode === "url" ? "repository" : "files"}...</p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              {progressSteps.map((step, i) => (
                <div key={step} className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                  i < progressIndex ? "text-primary" : i === progressIndex ? "text-foreground" : "text-muted-foreground/40"
                }`}>
                  {i < progressIndex ? (
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                  ) : i === progressIndex ? (
                    <Loader2 size={16} className="animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                  )}
                  {step}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {status === "failed" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle size={32} className="text-destructive mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">Analysis Failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button onClick={() => setStatus("idle")} className="mt-4 px-6 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">Try Again</button>
          </motion.div>
        )}

        {/* Result */}
        {status === "completed" && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 size={18} />
                <span className="text-sm font-semibold">Documentation Generated</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* View toggle */}
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                      viewMode === "preview" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => setViewMode("raw")}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                      viewMode === "raw" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Code size={14} /> Raw
                  </button>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
                  <Copy size={14} /> Copy
                </button>
                <button onClick={() => handleDownload("md")} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
                  <Download size={14} /> .md
                </button>
                <button onClick={() => handleDownload("html")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm">
                  <Download size={14} /> .html
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">README.md</span>
              </div>
              <div className="p-6 overflow-x-auto max-h-[700px] overflow-y-auto">
                {viewMode === "preview" ? (
                  <MarkdownRenderer content={result} />
                ) : (
                  <pre className="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">{result}</pre>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;
