import { AuthService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  // outros campos que seu JWT tem
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para salvar token e extrair usuário
  const saveToken = (jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    try {
      const decoded = jwtDecode<User>(jwtToken);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  };

  // Remover token e user
  const clearAuth = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Ao iniciar, carregar token do localStorage e validar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Aqui poderia validar expiracao, por simplicidade só decodifico
      saveToken(storedToken);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await AuthService.login({ email, password });
      localStorage.setItem("token", result.token);
      console.log(result);
      if (result.access_token) {
        saveToken(result.access_token);
        return {};
      } else {
        return { error: result.message || "Erro no login" };
      }
    } catch (e) {
      return { error: "Erro de rede" };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        saveToken(data.token);
        return {};
      } else {
        return { error: data.message || "Erro no cadastro" };
      }
    } catch (e) {
      return { error: "Erro de rede" };
    }
  };

  const signOut = () => {
    clearAuth();
    // Opcional: chamar backend para invalidar token, se suportar
    fetch("/api/logout", { method: "POST" });
  };

  const resetPassword = async (email: string) => {
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) return {};
      const data = await res.json();
      return { error: data.message || "Erro no reset de senha" };
    } catch {
      return { error: "Erro de rede" };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // envia token para autorizar
        },
        body: JSON.stringify({ password }),
      });
      if (res.ok) return {};
      const data = await res.json();
      return { error: data.message || "Erro ao atualizar senha" };
    } catch {
      return { error: "Erro de rede" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
