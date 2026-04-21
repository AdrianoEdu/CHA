// Copyright (c) 2026-04-21
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export function toQuery(params: Record<string, any>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === "object") {
      search.append(key, JSON.stringify(value));
    } else {
      search.append(key, String(value));
    }
  });

  return search.toString();
}
