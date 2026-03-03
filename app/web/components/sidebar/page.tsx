// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";

export default function SideBar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col w-64 h-full bg-gray-900 text-gray-300">
      {/* Logo / Título */}
      <div className="flex flex-col gap-3 text-center py-6 px-6 border-b border-gray-800">
        <span className="text-lg font-bold text-white">
          Contabilidade H. Alvarenga LTDA
        </span>

        <span className="text-lg font-bold text-white">
          {`Bem vindo: ${user.name} ${user.lastName}`}
        </span>
      </div>
      {/* Menu */}
      <nav className="flex-1 text-center px-3 py-4 space-y-2">
        {/* Item */}
        <Link
          href="/web/view/home/dashboard"
          className="flex justify-center px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition"
        >
          <span className="ml-3">Dashboard</span>
        </Link>

        <Link
          href="/web/view/home/employee"
          className="flex justify-center px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition"
        >
          <span className="ml-3">Funcionários</span>
        </Link>
      </nav>
      {/* Rodapé */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full px-3 py-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
