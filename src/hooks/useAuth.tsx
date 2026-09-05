import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roleLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  roleLoading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const resolveRole = async (session: Session | null) => {
      setRoleLoading(true);
      if (!session?.user) {
        setIsAdmin(false);
        setRoleLoading(false);
        return;
      }
      await checkAdminRole(session.user.id);
      setRoleLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      void resolveRole(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      void resolveRole(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    setIsAdmin(false);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!error && Boolean(data));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, roleLoading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
