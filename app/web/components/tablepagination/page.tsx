// Copyright (c) 2026-05-25
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

interface TablePaginationProps {
  take: number;
  totalRows: number;
  currentPage: number;

  /**
   * dispara quando trocar página
   */
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  take,
  totalRows,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalRows / take);

  if (totalPages <= 1) {
    return null;
  }

  const pages: (number | string)[] = [];

  /**
   * sempre mostra:
   *
   * 1 2 3 ... 10
   * 1 2 3 4 ... 10
   * 1 ... 4 5 6 ... 10
   */

  pages.push(1);

  if (currentPage > 4) {
    pages.push("...");
  }

  const startPage = Math.max(2, currentPage - 1);

  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  const handlePrevious = () => {
    if (currentPage <= 1) return;

    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage >= totalPages) return;

    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      {/* esquerda */}
      <div className="text-sm text-slate-500">
        Total de registros: {totalRows}
      </div>

      {/* direita */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-slate-300 disabled:opacity-50"
        >
          Anterior
        </button>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="px-2 text-slate-400">
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={`
                min-w-[36px]
                h-9
                px-3
                rounded-md
                border
                transition
                ${
                  isActive
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-slate-300 hover:bg-slate-100"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-slate-300 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
