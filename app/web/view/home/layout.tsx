"use client";

import { toast } from "react-toastify";
import SideBar from "../../components/sidebar/page";
import { ActionEnum } from "../../dto/auth.dto";
import { authService } from "../../services/authService/authService";
import { useRouter } from "next/navigation";
export default function Home({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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
    <div className="flex h-screen bg-off-white">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar onLogout={logout} />
      </div>

      <div className="flex-1 bg-off-white p-6">{children}</div>
    </div>
  );
}
