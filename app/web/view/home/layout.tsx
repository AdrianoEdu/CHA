"use client";

import { toast } from "react-toastify";
import SideBar from "../../components/sidebar/sidebar";
import { authService } from "../../services/authService/authService";
import { useRouter } from "next/navigation";
export default function Home({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-off-white">
      <div className="w-80 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 bg-off-white p-6">{children}</div>
    </div>
  );
}
