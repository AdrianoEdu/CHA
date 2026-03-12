"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService/authService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthDto } from "../dto/auth.dto";
import { ActionEnum } from "../constants/enum";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthDto;
  logout: () => Promise<void>;
  isAuthenticated: () => Promise<void>;
  auth: (userName: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthDto>({
    name: "",
    lastName: "",
    role: undefined,
  });

  useEffect(() => {
    isAuthenticated();
  }, []);
  const auth = async (userName: string, password: string): Promise<void> => {
    try {
      const result = (await authService.login({
        login: userName,
        password,
        type: ActionEnum.Login,
      })) as AuthDto;

      setUser(result);
      router.push("home");
      toast.success("Auntenticação bem sucedida");
    } catch (err) {
      toast.error("Erro na autenticação");
    }
  };

  const isAuthenticated = async (): Promise<void> => {
    try {
      const result = await authService.isLogged({ type: ActionEnum.IsLogged });

      if (!result.name && !result.lastName) {
        router.push("/web/view/login");
        return;
      }

      setUser(result);
      router.push("/web/view/home");
      toast.success("Usuário Autenticado");
    } catch {
      router.push("/web/view/login");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout({ type: ActionEnum.Logout });

      router.replace("/web/view/login");
      toast.success("Logout feito com sucesso");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, auth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
