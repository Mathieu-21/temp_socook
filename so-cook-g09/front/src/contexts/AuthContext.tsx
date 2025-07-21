import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContextDefinition";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // TODO: décoder réellement le token
    setUser({ id: "demo", email: "demo@so-cook.fr" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) login(token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
