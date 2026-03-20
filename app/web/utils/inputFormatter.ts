// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type FormatterResult = {
  raw: string;
  formatted: string;
};

export function formatCNPJ(value: string) {
  const raw = value.replace(/\D/g, "");

  const formatted = raw
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);

  return { raw, formatted };
}

export function formatMoney(value: string) {
  const rawDigits = value.replace(/\D/g, "");

  const numberValue = Number(rawDigits) / 100;

  const formatted = numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return {
    raw: numberValue.toString(),
    formatted,
  };
}
