import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Copy, Download, Loader2, Github, CheckCircle2, AlertCircle,
  Upload, FolderOpen, LogOut, Eye, Code, Palette, Share2, History,
  FileDown, FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ExportTemplateModal from "@/components/ExportTemplateModal";
import DocStatsBar from "@/components/DocStatsBar";
import DocumentTypeSelector, { type DocType } from "@/components/DocumentTypeSelector";
import LanguageSelector from "@/components/LanguageSelector";
import VoiceInput from "@/components/VoiceInput";

type JobStatus = "idle" | "processing" | "completed" | "failed";
type InputMode = "url" | "file" | "text";
type ViewMode = "preview" | "raw";

const progressSteps = [
  "Connecting to AI engine...",
  "Analyzing input content...",
  "Building document structure...",
  "Generating sections via AI...",
  "Adding diagrams & formatting...",
  "Finalizing document...",
];

const AnalyzePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [files, setFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [progressIndex, setProgressIndex] = useState(0);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // New feature states
  const [docType, setDocType] = useState<DocType>("readme");
  const [language, setLanguage] = useState("English");
  const [topic, setTopic] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [userName, setUserName] = useState("");

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
    if (inputMode === "text" && !topic.trim()) {
      toast.error("Please enter a topic or description");
      return;
    }

    setStatus("processing");
    setResult("");
    setError("");

    try {
      const body: Record<string, string> = {
        doc_type: docType,
        language,
        key_points: keyPoints,
        topic: topic,
        user_name: userName,
      };

      if (inputMode === "url") {
        body.repo_url = repoUrl.trim();
      } else if (inputMode === "file") {
        body.file_content = await readFilesContent(files);
        body.project_name = files[0]?.webkitRelativePath?.split("/")[0] || "Project";
      }

      const { data, error: fnError } = await supabase.functions.invoke("analyze-repo", { body });

      if (fnError) throw new Error(fnError.message || "Generation failed");
      if (data?.error) throw new Error(data.error);

      setResult(data.result);
      setStatus("completed");
      toast.success("Document generated successfully!");
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
      setStatus("failed");
      toast.error(e.message || "Generation failed");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "AutoDoc AI", text: result.slice(0, 200) + "..." });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType}-document.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown downloaded!");
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups for PDF export");
      return;
    }
    const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Document</title>
<style>
body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:40px;line-height:1.7;color:#1a1a2e}
h1{font-size:2rem;border-bottom:2px solid #e2e8f0;padding-bottom:8px}
h2{font-size:1.5rem;margin-top:2rem;border-bottom:1px solid #e2e8f0;padding-bottom:6px}
h3{font-size:1.2rem;margin-top:1.5rem}
pre{background:#f8f9fa;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{padding:8px 12px;border:1px solid #e2e8f0;text-align:left}
th{background:#f8f9fa}
blockquote{border-left:4px solid #3b82f6;padding:8px 16px;margin:1rem 0;background:#f0f9ff}
@media print{body{padding:0}}
</style></head><body>
<pre style="white-space:pre-wrap;word-wrap:break-word;border:none;background:transparent;font-family:inherit;font-size:inherit;padding:0">${result.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
    toast.success("PDF print dialog opened!");
  };

  const handleDownloadDocx = () => {
    // Simple HTML-to-DOCX via Blob with Word-compatible HTML
    const htmlContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>
body{font-family:Calibri,sans-serif;line-height:1.6;color:#1a1a2e}
h1{font-size:24pt;color:#1e40af}h2{font-size:18pt;color:#1e40af;border-bottom:1pt solid #e2e8f0}
h3{font-size:14pt;color:#334155}pre{background:#f8f9fa;padding:12px;font-family:Consolas,monospace;font-size:10pt}
code{background:#f1f5f9;padding:2px 4px;font-family:Consolas,monospace;font-size:10pt}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:6px 10px}th{background:#f1f5f9}
</style></head><body>
<pre style="white-space:pre-wrap;font-family:Calibri;font-size:11pt">${result.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body></html>`;
    const blob = new Blob([htmlContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType}-document.docx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("DOCX downloaded!");
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
          <div className="flex items-center gap-3">
            <Link to="/history" className="text-muted-foreground hover:text-foreground transition-colors" title="History">
              <History size={18} />
            </Link>
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors" title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Intelligent <span className="text-gradient-primary">Document Architect</span>
          </h1>
          <p className="text-muted-foreground">Generate professional documents with AI — READMEs, resumes, reports, proposals & more.</p>
        </motion.div>

        {status === "idle" || status === "failed" ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-6">
            {/* Document Type */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Document Type</label>
              <DocumentTypeSelector value={docType} onChange={setDocType} />
            </div>

            {/* Language */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Language</label>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>
              {(docType === "resume") && (
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Input Mode Toggle */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Input Source</label>
              <div className="flex gap-2">
                {[
                  { mode: "text" as InputMode, icon: FileText, label: "Text Input" },
                  { mode: "url" as InputMode, icon: Github, label: "Repository URL" },
                  { mode: "file" as InputMode, icon: FolderOpen, label: "Local Files" },
                ].map((m) => (
                  <button
                    key={m.mode}
                    onClick={() => setInputMode(m.mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      inputMode === m.mode ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    <m.icon size={16} /> {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            {inputMode === "text" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Topic / Description</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={docType === "resume" ? "Full-Stack Developer with 5 years experience" : "Enter your topic or project description"}
                      className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    />
                    <VoiceInput
                      onTranscript={(text) => setTopic((prev) => prev ? prev + " " + text : text)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Key Points (optional)</label>
                  <div className="flex gap-2 items-start">
                    <textarea
                      value={keyPoints}
                      onChange={(e) => setKeyPoints(e.target.value)}
                      placeholder="Enter key points, skills, requirements, or details to include..."
                      rows={4}
                      className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                    />
                    <VoiceInput
                      onTranscript={(text) => setKeyPoints((prev) => prev ? prev + " " + text : text)}
                    />
                  </div>
                </div>
              </div>
            )}

            {inputMode === "url" && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Repository URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    />
                  </div>
                </div>
              </div>
            )}

            {inputMode === "file" && (
              <div>
                <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload size={28} className="text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to select a folder or files</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                    {...({ webkitdirectory: "", directory: "" } as any)}
                  />
                </label>
                {files.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">{files.length} files selected</p>
                )}
              </div>
            )}

            {/* Error display */}
            {status === "failed" && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
                <AlertCircle size={24} className="text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleAnalyze}
              disabled={false}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 glow-primary"
            >
              Generate Document
            </button>
          </motion.div>
        ) : null}

        {/* Processing */}
        {status === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-8">
            <div className="text-center mb-6">
              <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground font-semibold">Generating your {docType} document...</p>
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

        {/* Result */}
        {status === "completed" && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <DocStatsBar content={result} />

            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 size={18} />
                <span className="text-sm font-semibold">Document Generated</span>
              </div>
              <div className="flex gap-2 flex-wrap">
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
                <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
                  <Copy size={14} /> Copy
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
                  <Share2 size={14} />
                </button>
                <button onClick={handleDownloadMd} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
                  <Download size={14} /> .md
                </button>
                <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
                  <FileDown size={14} /> PDF
                </button>
                <button onClick={handleDownloadDocx} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
                  <FileDown size={14} /> DOCX
                </button>
                <button onClick={() => setShowTemplateModal(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm glow-primary">
                  <Palette size={14} /> Templates
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">{docType}-document.md</span>
              </div>
              <div className="p-6 overflow-x-auto max-h-[700px] overflow-y-auto">
                {viewMode === "preview" ? (
                  <MarkdownRenderer content={result} />
                ) : (
                  <pre className="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">{result}</pre>
                )}
              </div>
            </div>

            {/* New Document button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => { setStatus("idle"); setResult(""); }}
                className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm font-medium"
              >
                Generate Another Document
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <ExportTemplateModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        content={result}
      />
    </div>
  );
};

export default AnalyzePage;
