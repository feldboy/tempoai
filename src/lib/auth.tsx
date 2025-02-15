import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authUser = {
          id: session.user.id,
          name:
            session.user.user_metadata.full_name ||
            session.user.email?.split("@")[0],
          email: session.user.email,
          avatarUrl:
            session.user.user_metadata.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
        };
        setUser(authUser);
        localStorage.setItem("user", JSON.stringify(authUser));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const authUser = {
          id: session.user.id,
          name:
            session.user.user_metadata.full_name ||
            session.user.email?.split("@")[0],
          email: session.user.email,
          avatarUrl:
            session.user.user_metadata.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
        };
        setUser(authUser);
        localStorage.setItem("user", JSON.stringify(authUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://awesome-driscoll9-l3anj.dev.tempolabs.ai/signin",
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
          },
        },
      });

      if (error) {
        console.error("Error signing in:", error);
        throw error;
      }

      if (!data.url) {
        throw new Error("No OAuth URL returned");
      }
    } catch (error) {
      console.error("Failed to sign in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
export default AuthProvider;
