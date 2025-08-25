import { useEffect, useMemo, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { login as doLogin, logout as doLogout, getSession } from "../services/auth";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loginOpen, setLoginOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Load session on mount
  useEffect(() => {
    const s = getSession();
    if (s) {
      setSession(s);
      setLoginOpen(false);
    }
  }, []);

  // Auto-logout when expired
  useEffect(() => {
    if (!session?.expiresAt) return;
    const ms = Math.max(0, session.expiresAt - Date.now());
    const t = setTimeout(() => {
      doLogout();
      setSession(null);
      setLoginOpen(true);
    }, ms);
    return () => clearTimeout(t);
  }, [session?.expiresAt]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const login = useCallback(async (username, password) => {
    try {
      const s = await doLogin(username, password);
      setSession(s);
      setLoginOpen(false);
      setShowWelcome(true);
      // Hide welcome after 2s
// Hide welcome after 3s
setTimeout(() => setShowWelcome(false), 2500);

      return s;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setSession(null);
    setLoginOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      loginOpen,
      openLogin,
      closeLogin,
      showWelcome,
    }),
    [session, login, logout, loginOpen, openLogin, closeLogin, showWelcome]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
