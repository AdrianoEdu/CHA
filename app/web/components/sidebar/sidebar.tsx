"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

type MenuKey = "bank" | "financial" | "employee" | "customer" | "transaction";

export default function SideBar() {
  const { user, logout } = useAuth();

  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);

  const fullName =
    user?.name && user?.lastName
      ? `${user.name} ${user.lastName}`
      : "Carregando...";

  const toggleMenu = (menu: MenuKey) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <aside className="flex flex-col h-full bg-gray-900 text-gray-300">
      <div className="flex flex-col gap-3 text-center py-6 px-6 border-b border-gray-800">
        <span className="text-lg font-bold text-white">
          Contabilidade H. Alvarenga LTDA
        </span>

        <span className="text-sm text-gray-400">Bem-vindo: {fullName}</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {/* Banco */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleMenu("bank")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition"
          >
            <span>Banco</span>

            <span>{openMenu === "bank" ? "−" : "+"}</span>
          </button>

          {openMenu === "bank" && (
            <div className="flex flex-col bg-gray-850">
              <Link
                href="/web/view/home/bank/register"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Registrar
              </Link>

              <Link
                href="/web/view/home/bank/accounts"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Contas Bancárias
              </Link>
            </div>
          )}
        </div>

        {/* Financeiro */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleMenu("financial")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition"
          >
            <span>Financeiro</span>

            <span>{openMenu === "financial" ? "−" : "+"}</span>
          </button>

          {openMenu === "financial" && (
            <div className="flex flex-col">
              <Link
                href="/web/view/home/financial"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Dashboard
              </Link>

              <Link
                href="/web/view/home/financial/reports"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Relatórios
              </Link>
            </div>
          )}
        </div>

        {/* Clientes */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleMenu("customer")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition"
          >
            <span>Clientes</span>

            <span>{openMenu === "customer" ? "−" : "+"}</span>
          </button>

          {openMenu === "customer" && (
            <div className="flex flex-col">
              <Link
                href="/web/view/home/customer"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Listagem
              </Link>

              <Link
                href="/web/view/home/customer/create"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Novo cliente
              </Link>
            </div>
          )}
        </div>

        {/* Funcionários */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleMenu("employee")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition"
          >
            <span>Funcionários</span>

            <span>{openMenu === "employee" ? "−" : "+"}</span>
          </button>

          {openMenu === "employee" && (
            <div className="flex flex-col">
              <Link
                href="/web/view/home/employee"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Listagem
              </Link>

              <Link
                href="/web/view/home/employee/create"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Novo funcionário
              </Link>
            </div>
          )}
        </div>

        {/* Transações */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleMenu("transaction")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition"
          >
            <span>Transações</span>

            <span>{openMenu === "transaction" ? "−" : "+"}</span>
          </button>

          {openMenu === "transaction" && (
            <div className="flex flex-col">
              <Link
                href="/web/view/home/transaction"
                className="px-8 py-3 hover:bg-gray-700 transition"
              >
                Histórico
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-500 transition text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
