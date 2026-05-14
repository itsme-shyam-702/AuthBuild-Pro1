import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if tokens exist, fetch /profile to restore session
  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem("accessToken")) { setLoading(false); return; }
      try {
        const { data } = await api.get("/users/profile");
        setUser(data);
      } catch { /* interceptor handles refresh or redirect */ }
      finally { setLoading(false); }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
    return data;
  };

  const register = async (email, password) => {
    const { data } = await api.post("/auth/register", { email, password });
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
  };

  const logout = async () => {
    const rt = localStorage.getItem("refreshToken");
    try { await api.post("/auth/logout", { refreshToken: rt }); } catch {}
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);