"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService/authService";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthDto } from "../dto/auth.dto";
import { ActionEnum } from "../constants/enum";
import LoadingModal from "../components/modal/loaded/loaded";
import { useModal } from "./ModalProvider";
import { healthService } from "../services/healthService/healthService";
import { i18n } from "../constants/i18n";

interface AuthContextType {
  user: AuthDto;
  logout: () => Promise<void>;
  isAuthenticated: () => Promise<void>;
  auth: (userName: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultPath = "/web/view";
const homePath = `${defaultPath}/home`;
const loginPath = `${defaultPath}/login`;

const { Toast } = i18n["Pt-Br"].Screen.Login;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthDto>({
    name: "",
    lastName: "",
    role: undefined,
  });

  const pathname = usePathname();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    isAuthenticated();
  }, [pathname]);

  const auth = async (userName: string, password: string): Promise<void> => {
    try {
      const healthStatus = await healthService.getHealth();

      if (!healthStatus.database) {
        toast.error(Toast.systemDownError);
        return;
      }

      const result = (await authService.login({
        login: userName,
        password,
        type: ActionEnum.Login,
      })) as AuthDto;

      setUser(result);
      router.push(homePath);
      toast.success(Toast.authSuccess);
    } catch (err) {
      toast.error(Toast.authError);
    }
  };

  const isAuthenticated = async (): Promise<void> => {
    try {
      startLoading();

      const result = await authService.isLogged({ type: ActionEnum.IsLogged });

      const isLogged = result.name && result.lastName;

      if (!isLogged) {
        router.push(loginPath);
        return;
      }

      setUser(result);

      if (
        pathname === "/" ||
        pathname === loginPath ||
        pathname === defaultPath
      ) {
        router.push(homePath);
        toast.success("Usuário Autenticado");
      }
    } catch {
      router.push(loginPath);
    } finally {
      stopLoading();
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout({ type: ActionEnum.Logout });

      router.replace(loginPath);
      toast.success("Logout feito com sucesso");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const startLoading = (): void => {
    openModal(<LoadingModal />, "", false);
  };

  const stopLoading = (): void => {
    closeModal();
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
