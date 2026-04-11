// Copyright (c) 2026-04-08
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export function sortStringNumbers(list: string[]): string[] {
  return list
    .map((item) => Number(item))
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b)
    .map((num) => String(num));
}
