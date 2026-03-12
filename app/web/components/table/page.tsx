// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import React from "react";

export interface TableColumn<T> {
  label: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  isAction?: boolean;
}

interface TableProps<T> {
  title?: string;
  rows?: T[] | null;
  columns: TableColumn<T>[];
  onActionClicked?: () => void;
  onRowClick?: (row: T) => void;

  enableFilter?: boolean;
  onFilterChange?: (value: string) => void;
}

function formatValue(value: unknown) {
  if (!value) return "-";

  const date = new Date(value as string);
  if (!isNaN(date.getTime())) {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return String(value);
}

export default function Table<T>({
  title = "Tabela",
  columns,
  rows,
  onActionClicked,
  onRowClick,
  enableFilter = false,
  onFilterChange,
}: TableProps<T>) {
  const safeRows: T[] = Array.isArray(rows) ? rows : [];

  const [filter, setFilter] = React.useState("");
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  function handleFilterChange(value: string) {
    setFilter(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onFilterChange?.(value);
    }, 500);
  }

  return (
    <div className="relative font-inter antialiased">
      <main className="relative min-h-screen flex flex-col bg-slate-50 overflow-x-auto">
        <div className="w-full px-3 md:px-6 pt-12 pb-24">
          <div className="flex justify-start">
            <div className="w-full bg-white shadow-xl rounded-2xl">
              {/* HEADER */}
              <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-lg">
                  {title}
                </h2>

                <div className="flex items-center gap-2">
                  {enableFilter && (
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      value={filter}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      className="border border-slate-300 rounded-md px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}

                  {onActionClicked && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                      onClick={onActionClicked}
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              </header>

              <div className="p-6">
                <div className="overflow-x-auto w-full">
                  <table className="table-auto w-full text-center">
                    <thead className="text-[13px] text-slate-500/70">
                      <tr>
                        {columns.map((col, index) => (
                          <th key={index} className="px-5 py-2 bg-slate-100">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="text-sm font-medium">
                      {safeRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="py-6 text-slate-400"
                          >
                            Nenhum registro encontrado
                          </td>
                        </tr>
                      ) : (
                        safeRows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`border-b border-slate-200 ${
                              onRowClick
                                ? "cursor-pointer hover:bg-slate-100 transition"
                                : ""
                            }`}
                            onClick={() => onRowClick?.(row)}
                          >
                            {columns.map((col, colIndex) => (
                              <td key={colIndex} className="px-5 py-2">
                                {col.render
                                  ? col.render(row)
                                  : col.accessor
                                    ? formatValue((row as any)[col.accessor])
                                    : "-"}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
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
          &copy; 2026 Contabilidade H. Alvarenga LTDA - Developed by Adriano
          Trentin Jr. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
