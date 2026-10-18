// Copyright (c) 2026-10-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import SideBarAction from "../sidebarAction/sidebarAction";

type MenuKey =
  | "bank"
  | "financial"
  | "employee"
  | "customer"
  | "report"
  | "move"
  | "payment";

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
        <SideBarAction
          title="Banco"
          isOpen={openMenu === "bank"}
          onToggle={() => toggleMenu("bank")}
        >
          <Link
            href="/web/view/home/bank/register"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Cadastro
          </Link>

          <Link
            href="/web/view/home/bank/accounts"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Contas Bancárias
          </Link>
        </SideBarAction>

        <SideBarAction
          title="Entrada e Saída"
          isOpen={openMenu === "financial"}
          onToggle={() => toggleMenu("financial")}
        >
          <Link
            href="/web/view/home/financial"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Cadastrar
          </Link>
        </SideBarAction>

        <SideBarAction
          title="Clientes"
          isOpen={openMenu === "customer"}
          onToggle={() => toggleMenu("customer")}
        >
          <Link
            href="/web/view/home/customer"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Listagem
          </Link>

          <Link
            href="/web/view/home/customer/register"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Registrar
          </Link>
        </SideBarAction>

        <SideBarAction
          title="Funcionários"
          isOpen={openMenu === "employee"}
          onToggle={() => toggleMenu("employee")}
        >
          <Link
            href="/web/view/home/employee"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Listagem
          </Link>

          <Link
            href="/web/view/home/employee/register"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Registrar
          </Link>
        </SideBarAction>

        <SideBarAction
          title="Movimentações"
          isOpen={openMenu === "move"}
          onToggle={() => toggleMenu("move")}
        >
          <Link
            href="/web/view/home/move/cash-book"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Livro Caixa
          </Link>

          <Link
            href="/web/view/home/move/received-check"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Cheques pré-datados clientes
          </Link>
        </SideBarAction>

        <SideBarAction
          title="Pagamentos"
          isOpen={openMenu === "payment"}
          onToggle={() => toggleMenu("payment")}
        >
          <Link
            href="/web/view/home/payment/list"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Listagem
          </Link>

          <Link
            href="/web/view/home/payment/recurring-payment"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Pagamentos programados
          </Link>
        </SideBarAction>

        <SideBarAction
          title="Relatórios"
          isOpen={openMenu === "report"}
          onToggle={() => toggleMenu("report")}
        >
          <Link
            href="/web/view/home/report/cash-book"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Livro Caixa
          </Link>

          <Link
            href="/web/view/home/report/received-check"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Cheques pré-datados clientes
          </Link>

          <Link
            href="/web/view/home/report/employee"
            className="px-8 py-3 hover:bg-gray-700 transition"
          >
            Funcionário
          </Link>
        </SideBarAction>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          type="button"
          onClick={logout}
          className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-500 transition text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
