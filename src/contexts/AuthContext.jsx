import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("admin_auth") === "true",
  );

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("admin_auth", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("adminTokens");
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

