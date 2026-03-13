import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, Loader2, Github, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type JobStatus = "idle" | "processing" | "completed" | "failed";

const AnalyzePage = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }

    setStatus("processing");
    setResult("");
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-repo", {
        body: { repo_url: repoUrl.trim() },
      });

      if (fnError) {
        throw new Error(fnError.message || "Analysis failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

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

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-border">
              <span className="font-mono font-bold text-primary text-sm">A</span>
            </div>
            <span className="font-bold text-foreground">
              AutoDoc <span className="text-primary">AI</span>
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Generate <span className="text-gradient-primary">Documentation</span>
          </h1>
          <p className="text-muted-foreground">
            Paste your repository URL and let AI create comprehensive docs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                disabled={status === "processing"}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={status === "processing"}
              className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-primary"
            >
              {status === "processing" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Generate Docs"
              )}
            </button>
          </div>
        </motion.div>

        {/* Processing State */}
        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground font-semibold mb-1">Analyzing repository...</p>
            <p className="text-sm text-muted-foreground">
              Parsing code, building AST, generating documentation via AI
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center"
          >
            <AlertCircle size={32} className="text-destructive mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">Analysis Failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 px-6 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Result */}
        {status === "completed" && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Actions bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 size={18} />
                <span className="text-sm font-semibold">Documentation Generated</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm"
                >
                  <Copy size={14} />
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm"
                >
                  <Download size={14} />
                  Download .md
                </button>
              </div>
            </div>

            {/* Markdown preview */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">README.md</span>
              </div>
              <pre className="p-6 overflow-x-auto text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                {result}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;
