// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export function validateIsNan(number: number) {
  return Number.isNaN(number) ? 0 : number;
}
