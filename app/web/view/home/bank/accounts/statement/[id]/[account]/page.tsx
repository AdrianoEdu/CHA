// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { IncomeIcon } from "@/app/web/icons/in-icon";
import { ExpenseIcon } from "@/app/web/icons/out-icon";
import { useState } from "react";

interface StatementDto {
  id: string;
  date: string;
  description: string;
  document: string;
  value: number;
  balance: number;
  type: "income" | "expense";
}

export default function StatementPage() {
  const [search, setSearch] = useState("");

  const statements: StatementDto[] = [
    {
      id: "1",
      date: "19/07/2026 14:20",
      description: "PIX Recebido",
      document: "João da Silva",
      value: 250,
      balance: 5250,
      type: "income",
    },
    {
      id: "2",
      date: "19/07/2026 11:40",
      description: "Pagamento de Boleto",
      document: "CEMIG",
      value: 180,
      balance: 5070,
      type: "expense",
    },
  ];

  const filteredStatements = statements.filter(
    (statement) =>
      statement.description.toLowerCase().includes(search.toLowerCase()) ||
      statement.document.toLowerCase().includes(search.toLowerCase()),
  );

  const handleNewStatement = () => {
    console.log("Novo lançamento");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="rounded-2xl bg-white shadow-xl p-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Extrato Bancário
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Acompanhe todas as movimentações desta conta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <span className="text-sm text-slate-400">Banco</span>

              <p className="font-semibold">Banco do Brasil</p>
            </div>

            <div>
              <span className="text-sm text-slate-400">Conta</span>

              <p className="font-semibold">00012345-6</p>
            </div>

            <div>
              <span className="text-sm text-slate-400">Saldo Atual</span>

              <p className="text-3xl font-bold text-green-600">R$ 5.250,00</p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-4
            mb-6
          "
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar movimentação..."
            className="
              w-full
              rounded-lg
              border
              border-slate-200
              px-4
              py-3
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        {/* LISTA */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-xl
            overflow-hidden
          "
        >
          <div
            className="
              px-6
              py-4
              border-b
            "
          >
            <h2 className="font-semibold text-lg">Movimentações</h2>
          </div>

          {filteredStatements.map((statement) => (
            <div
              key={statement.id}
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                hover:bg-slate-50
                transition
                cursor-pointer
              "
            >
              <div className="flex gap-4 items-center">
                <div
                  className={`
                    h-12
                    w-12
                    rounded-full
                    flex
                    items-center
                    justify-center

                    ${
                      statement.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }
                  `}
                >
                  {statement.type === "income" ? (
                    <IncomeIcon />
                  ) : (
                    <ExpenseIcon />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {statement.description}
                  </p>

                  <p className="text-sm text-slate-500">{statement.document}</p>

                  <p className="text-xs text-slate-400 mt-1">
                    {statement.date}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`
                    text-xl
                    font-bold

                    ${
                      statement.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  `}
                >
                  {statement.type === "income" ? "+" : "-"} R${" "}
                  {statement.value.toFixed(2)}
                </p>

                <p className="text-sm text-slate-500">
                  Saldo: R$ {statement.balance.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={handleNewStatement}
        title="Adicionar movimentação"
        className="
          fixed
          bottom-8
          right-8
          z-50

          h-16
          w-16

          rounded-full

          bg-blue-600
          text-white

          flex
          items-center
          justify-center

          text-4xl
          font-light

          shadow-2xl

          transition-all
          duration-200

          hover:bg-blue-700
          hover:scale-110

          active:scale-95
        "
      >
        +
      </button>
    </div>
  );
}
