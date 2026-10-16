// Copyright (c) 2026-10-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

function calculateDueDate(dueDay: number): Date {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDay = new Date(year, month + 1, 0).getDate();
  const day = Math.min(dueDay, lastDay);

  return new Date(year, month, day);
}
