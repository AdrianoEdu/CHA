// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type FormatterResult = {
  raw: string;
  formatted: string;
};

export function formatCPF(value: string) {
  const raw = value.replace(/\D/g, "").slice(0, 11);

  const formatted = raw
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

  return {
    raw,
    formatted,
  };
}

export function formatPhone(value: string): {
  raw: string;
  formatted: string;
} {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return { raw: "", formatted: "" };
  }

  const ddd = digits.slice(0, 2);
  const isMobile = digits.length > 2 && digits[2] === "9";
  const maxLength = isMobile ? 11 : 10;
  const raw = digits.slice(0, maxLength);

  if (raw.length <= 2) {
    return {
      raw,
      formatted: `(${raw}`,
    };
  }

  const phoneNumber = raw.slice(2);
  const mobile = phoneNumber.startsWith("9");

  if (mobile) {
    return {
      raw,
      formatted: `(${ddd}) ${phoneNumber.slice(0, 5)}${
        phoneNumber.length > 5 ? `-${phoneNumber.slice(5, 9)}` : ""
      }`,
    };
  }

  return {
    raw,
    formatted: `(${ddd}) ${phoneNumber.slice(0, 4)}${
      phoneNumber.length > 4 ? `-${phoneNumber.slice(4, 8)}` : ""
    }`,
  };
}

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
