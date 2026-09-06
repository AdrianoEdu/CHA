// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CurrentAccountType } from "@/app/generated/prisma";
import { GetBankDto } from "../Bank/bank";

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
  currentAccountType: CurrentAccountType;
};

export type GetCurrentAccountParamsDto = {
  count: number;
  currentAccount: GetCurrentAccountDto[];
};
