
// Copyright (c) 2026-11-24
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ReceivedCheckDTO } from "@/app/web/dto/receive-check.dto";
import { ReceivedCheckStatus } from "@/app/web/constants/enum";
import { receiveCheckService } from "../../services/receiveCheckService/receiveCheckService";

export type SelectReceivedChecksProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value?: Date): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

export default function SelectReceivedChecks({
  selectedIds,
  onChange,
  disabled = false,
}: SelectReceivedChecksProps) {
  const [checks, setChecks] = useState<ReceivedCheckDTO[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetReceivedChecks = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const { receivedChecks } =
        await receiveCheckService.findAll({
          where: {
            status: ReceivedCheckStatus.RECEIVED,
          },
          take: 1000,
          orderBy: {
            createdAt: "desc",
          },
        });

      setChecks(receivedChecks);
    } catch {
      setError("Não foi possível carregar os cheques recebidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetReceivedChecks();
  }, [handleGetReceivedChecks]);

  const filteredChecks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) return checks;

    return checks.filter((check) =>
      [
        String(check.checkNumber),
        check.bank.name,
        check.agency ?? "",
        check.customer.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [checks, search]);

  const selectedChecks = checks.filter((check) =>
    selectedIds.includes(check.id),
  );

  const totalSelected = selectedChecks.reduce(
    (total, check) => total + check.amount,
    0,
  );

  const handleToggle = (id: string): void => {
    if (disabled) return;

    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  };

  const handleToggleAll = (): void => {
    if (disabled) return;

    const visibleIds = filteredChecks.map((check) => check.id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    onChange(
      allSelected
        ? selectedIds.filter((id) => !visibleIds.includes(id))
        : [...new Set([...selectedIds, ...visibleIds])],
    );
  };

  const allVisibleSelected =
    filteredChecks.length > 0 &&
    filteredChecks.every((check) => selectedIds.includes(check.id));

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:col-span-2">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-gray-800">
          Selecionar cheques para pagamento
        </h3>

        <p className="text-sm text-gray-500">
          Selecione os cheques recebidos que serão utilizados neste pagamento.
        </p>
      </div>

      <input
        type="text"
        value={search}
        disabled={disabled || loading}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por número, banco, agência ou cliente..."
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              disabled={disabled || loading || filteredChecks.length === 0}
              onChange={handleToggleAll}
              className="h-4 w-4 rounded"
            />
            Selecionar todos
          </label>

          <span className="text-xs text-gray-500">
            {checks.length} disponíveis
          </span>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            Carregando cheques recebidos...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-4 py-10">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={handleGetReceivedChecks}
              disabled={disabled}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredChecks.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            {checks.length === 0
              ? "Não existem cheques disponíveis para pagamento."
              : "Nenhum cheque encontrado."}
          </div>
        ) : (
          <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
            {filteredChecks.map((check) => {
              const selected = selectedIds.includes(check.id);

              return (
                <label
                  key={check.id}
                  className={`flex cursor-pointer items-start gap-3 px-4 py-4 transition-colors ${selected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => handleToggle(check.id)}
                    className="mt-1 h-4 w-4 rounded"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-gray-800">
                        Cheque nº {check.checkNumber}
                      </span>

                      <span className="font-semibold text-gray-800">
                        {formatCurrency(check.amount)}
                      </span>
                    </div>

                    <span className="text-sm text-gray-600">
                      {check.bank.name} · Agência {check.agency ?? "-"}
                    </span>

                    <span className="text-xs text-gray-500">
                      Cliente: {check.customer.name}
                    </span>

                    <span className="text-xs text-gray-500">
                      Bom para: {formatDate(check.goodForAt)}
                    </span>

                    {check.notes && (
                      <span className="mt-1 text-xs text-gray-500">
                        {check.notes}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <p className="text-sm text-gray-500">Cheques selecionados</p>
          <p className="font-semibold text-gray-800">
            {selectedChecks.length} cheque(s)
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total selecionado</p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(totalSelected)}
          </p>
        </div>
      </div>
    </div>
  );
}
