import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="/" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AutoDoc AI" className="w-8 h-8" />
          <span className="font-bold text-lg text-foreground">
            AutoDoc <span className="text-primary">AI</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 flex items-center gap-1.5">
                  <Shield size={14} /> Admin
                </Link>
              )}
              <Link to="/analyze" className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Dashboard
              </Link>
              <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link to="/auth" className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </a>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                      <Shield size={14} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/analyze" onClick={() => setMobileOpen(false)} className="mt-2 text-center font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg">
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="mt-2 text-center font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg">
                  Get Started Free
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
