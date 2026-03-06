import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("admin_auth") === "true"
  );

  const login = (email: string, password: string) => {
    if (email === "admin@shop.com" && password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
