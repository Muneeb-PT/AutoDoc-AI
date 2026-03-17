import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ExternalLink, Loader2, LogOut, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Job {
  id: string;
  repo_url: string;
  status: string;
  created_at: string;
  result_markdown: string | null;
}

const HistoryPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("analysis_jobs")
        .select("id, repo_url, status, created_at, result_markdown")
        .order("created_at", { ascending: false })
        .limit(50);
      setJobs(data || []);
      setLoading(false);
    };
    fetchJobs();
  }, [user]);

  const handleDownload = (job: Job) => {
    if (!job.result_markdown) return;
    const blob = new Blob([job.result_markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `docs-${job.id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/analyze" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <span className="font-bold text-foreground">Analysis <span className="text-primary">History</span></span>
          <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Your Analyses</h1>

        {jobs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Clock size={40} className="mx-auto mb-4 opacity-40" />
            <p>No analyses yet. <Link to="/analyze" className="text-primary hover:underline">Start your first one</Link>.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-foreground truncate">{job.repo_url}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      job.status === "completed" ? "bg-primary/10 text-primary" :
                      job.status === "failed" ? "bg-destructive/10 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(job.created_at).toLocaleDateString()} {new Date(job.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                {job.result_markdown && (
                  <button
                    onClick={() => handleDownload(job)}
                    className="ml-4 px-3 py-1.5 text-xs rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    Download
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
