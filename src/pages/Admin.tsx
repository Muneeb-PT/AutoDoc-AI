import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, FileText, Shield, Loader2, LogOut, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface AnalysisJob {
  id: string;
  repo_url: string;
  status: string;
  created_at: string;
  user_id: string | null;
  error_message: string | null;
}

const AdminPage = () => {
  const { user, loading: authLoading, roleLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "jobs">("users");
  const [users, setUsers] = useState<Profile[]>([]);
  const [jobs, setJobs] = useState<AnalysisJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !roleLoading && (!user || !isAdmin)) {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user, authLoading, roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        setUsers(data || []);
      } else {
        const { data, error } = await supabase.from("analysis_jobs").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        setJobs(data || []);
      }
    } catch (e) {
      toast.error("Failed to fetch data");
    }
    setLoading(false);
  };

  if (authLoading || roleLoading || !isAdmin) {
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
            <Shield size={18} className="text-primary" />
            <span className="font-bold text-foreground">Admin Panel</span>
          </div>
          <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Admin <span className="text-gradient-primary">Dashboard</span>
            </h1>
            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "users" ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
              }`}
            >
              <Users size={16} /> Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "jobs" ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
              }`}
            >
              <FileText size={16} /> Analysis Jobs ({jobs.length})
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : activeTab === "users" ? (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="p-4 text-foreground font-mono text-xs">{u.email}</td>
                        <td className="p-4 text-foreground">{u.full_name || "—"}</td>
                        <td className="p-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-4 text-muted-foreground font-medium">Repository</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="p-4 text-foreground font-mono text-xs max-w-[300px] truncate">{job.repo_url}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === "completed" ? "bg-primary/10 text-primary" :
                            job.status === "failed" ? "bg-destructive/10 text-destructive" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{new Date(job.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-destructive text-xs max-w-[200px] truncate">{job.error_message || "—"}</td>
                      </tr>
                    ))}
                    {jobs.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No jobs found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
