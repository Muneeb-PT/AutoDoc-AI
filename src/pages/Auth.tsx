import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/analyze");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/analyze");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in successfully!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to verify your account!");
      }
    } catch (e: any) {
      toast.error(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AutoDoc AI" className="w-8 h-8" />
            <span className="font-bold text-lg text-foreground">
              AutoDoc <span className="text-primary">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {isLogin ? "Sign in to access your documentation" : "Get started with AutoDoc AI"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 space-y-5">
          {!isLogin && (
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mohammed Muneeb"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-primary"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {isLogin ? "Sign In" : "Create Account"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;
