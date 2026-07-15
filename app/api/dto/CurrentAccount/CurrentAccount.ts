// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetBankDto } from "@/app/web/dto/bank.dto";

export type CreateCurrentAccountDto = {
  createdAt: Date;
  bankId: string;
  balance: number;
  accountNumber: string;
};

export type UpdateCurrentAccountDto = Partial<CreateCurrentAccountDto> & {
  id: string;
};

export type GetCurrentAccountDto = {
  id: string;
  createdAt: Date;
  balance: number;
  bank?: GetBankDto;
  accountNumber: string;
};

export type GetCurrentAccountParamsDto = {
  count: number;
  currentAccount: GetCurrentAccountDto[];
};
