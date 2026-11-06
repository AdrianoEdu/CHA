// Copyright (c) 2026-11-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

type EmployeeAdvanceFilter = {
  reasonName?: {
    value: string;
    mode: "insensitive";
  };
  amount?: number;
};
