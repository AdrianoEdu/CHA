// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType } from "@/app/generated/prisma";
import { GetBankDto } from "../Bank/bank";

export type CreateAccountDto = {
  createdAt: Date;
  bankId?: string;
  balance: number;
  accountNumber: string;
};

export type UpdateAccountDto = Partial<CreateAccountDto> & {
  id: string;
};

export type GetAccountDto = {
  id: string;
  createdAt: Date;
  balance: number;
  bank: GetBankDto | null;
  accountType: AccountType;
  accountNumber: string | null;
};

export type GetAccountParamsDto = {
  count: number;
  account: GetAccountDto[];
};
