// Copyright (c) 2026-20-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { HeaderStatementProps } from "./type";

export default function Header({
  headerTitle,
  balanceData,
  secondData,
  primaryData,
  buttonTitle,
  onClick,
}: HeaderStatementProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {headerTitle}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Acompanhe todas as movimentações desta conta
          </p>
        </div>

        {buttonTitle && (
          <button
            type="button"
            onClick={onClick}
            className="h-8 rounded-lg border-2 border-blue-default bg-off-white px-3 text-sm font-bold text-blue-default shadow transition-colors hover:bg-blue-default hover:text-off-white active:scale-95"          >
            {buttonTitle}
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <span className="text-sm text-slate-400">
            {primaryData.title}
          </span>

          <p className="font-semibold">
            {primaryData.description}
          </p>
        </div>

        {secondData && (
          <div>
            <span className="text-sm text-slate-400">
              {secondData.title}
            </span>

            <p className="font-semibold">
              {secondData.description}
            </p>
          </div>
        )}

        <div>
          <span className="text-sm text-slate-400">
            Saldo Atual
          </span>

          <p className="text-3xl font-bold text-green-600">
            {`R$ ${balanceData.toFixed(2)}`}
          </p>
        </div>
      </div>
    </div>
  );
}