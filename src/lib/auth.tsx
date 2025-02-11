import React, { createContext, useContext, useState, useEffect } from "react";

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

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In development, auto-sign in with a test account
    if (import.meta.env.DEV) {
      const devUser = {
        id: "dev-user",
        name: "Dev User",
        email: "dev@example.com",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=dev`,
      };
      setUser(devUser);
      localStorage.setItem("user", JSON.stringify(devUser));
    } else {
      // In production, check if user is already signed in
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const signIn = async () => {
    // Simulate Google Sign In
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Test User",
      email: "test@example.com",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth };
export default AuthProvider;
