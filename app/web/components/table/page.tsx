// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import React from "react";

interface TableColumn {
  label: string;
  key: string;
  isAction?: boolean;
}

interface TableProps {
  title?: string; // Título da tabela
  columns: TableColumn[]; // Colunas da tabela
  rows: Record<string, any>[]; // Linhas com valores variados
  onActionClicked: () => void;
}

const defaultColumns: TableColumn[] = [
  { label: "#", key: "id" },
  { label: "Nome", key: "name" },
  { label: "Símbolo", key: "symbol" },
  { label: "Preço", key: "price" },
  { label: "Supply", key: "supply" },
  { label: "1h", key: "change1h" },
  { label: "24h", key: "change24h" },
  { label: "7d", key: "change7d" },
  { label: "Ações", key: "action", isAction: true }, // Label em português
];

const defaultRows = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: "$27,000",
    supply: "19M",
    change1h: "+0.5%",
    change24h: "+2.3%",
    change7d: "+5.1%",
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: "$1,800",
    supply: "120M",
    change1h: "+0.3%",
    change24h: "+1.8%",
    change7d: "+4.0%",
  },
  {
    id: 3,
    name: "Cardano",
    symbol: "ADA",
    price: "$0.40",
    supply: "32B",
    change1h: "-0.1%",
    change24h: "+0.5%",
    change7d: "+1.2%",
  },
];

export default function Table({
  title = "My Wallet",
  columns = defaultColumns,
  rows = defaultRows,
  onActionClicked,
}: TableProps) {
  return (
    <div className="relative font-inter antialiased">
      <main className="relative min-h-screen flex flex-col bg-slate-50 overflow-x-auto">
        <div className="w-full px-3 md:px-6 pt-12 pb-24">
          <div className="flex justify-start">
            <div className="w-full bg-white shadow-xl rounded-2xl">
              {/* Header com botão */}
              <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-lg">
                  {title}
                </h2>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  onClick={onActionClicked}
                >
                  Adicionar
                </button>
              </header>

              <div className="p-6">
                <div className="overflow-x-auto w-full">
                  <table className="table-auto w-full min-w-250 text-center">
                    <thead className="text-[13px] text-slate-500/70 align-middle">
                      <tr>
                        {columns.map((col, index) => (
                          <th
                            key={index}
                            className="px-5 py-2 bg-slate-100 align-middle"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                      {rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-b border-slate-200"
                        >
                          {columns.map((col, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-5 py-2 align-middle"
                            >
                              {col.isAction ? (
                                <button className="text-blue-500">
                                  Action
                                </button>
                              ) : row[col.key] !== undefined ? (
                                row[col.key].toString()
                              ) : (
                                "-"
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute left-6 right-6 md:left-12 md:right-auto bottom-4 md:bottom-8 md:text-left">
        <span className="text-xs text-slate-500">
          &copy; 2026-03-02 Contabilidade H. Alvarenga LTDA - Developed by
          Adriano Trentin Jr. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
