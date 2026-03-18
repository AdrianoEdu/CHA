// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";

export default function SideBar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col w-64 h-full bg-gray-900 text-gray-300">
      <div className="flex flex-col gap-3 text-center py-6 px-6 border-b border-gray-800">
        <span className="text-lg font-bold text-white">
          Contabilidade H. Alvarenga LTDA
        </span>

        <span className="text-lg font-bold text-white">
          {`Bem vindo: ${user.name} ${user.lastName}`}
        </span>
      </div>
      <nav className="flex-1 text-center px-3 py-4 space-y-2">
        <Link
          href="/web/view/home/dashboard"
          className="flex justify-center px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition"
        >
          <span className="ml-3">Dashboard</span>
        </Link>

        <Link
          href="/web/view/home/register"
          className="flex justify-center px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition"
        >
          <span className="ml-3">Registro</span>
        </Link>
      </nav>
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
