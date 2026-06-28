// Copyright (c) 2026-06-25
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetBankDto } from "./bank.dto";

export type CurrentAccountDto = {
  createdAt: Date;
  updatedAt: Date;
  balance: number;
  bank: GetBankDto;
  accountNumber: number;
};
