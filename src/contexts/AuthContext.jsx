import { createContext, useContext } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { logout as logoutAction } from "@/store/authSlice";
import { useLogoutMutation } from "@/store/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);
  const [logoutApi] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Cookie may already be cleared; still clear local state
    }
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
