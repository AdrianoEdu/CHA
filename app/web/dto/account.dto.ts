// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetBankDto } from "@/app/web/dto/bank.dto";
import { PaginationDto } from "./pagination.dto";
import { AccountType } from "../constants/enum";

export type CreateAccountDto = {
  createdAt: Date;
  bankId: string;
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
  bank: GetBankDto;
  accountNumber: string;
  accountType: AccountType;
};

export type AccountWhere = Partial<GetAccountDto>;

export type AccountParams = PaginationDto<AccountWhere, any, any, any>;

export type GetAccountParamsDto = {
  count: number;
  account: GetAccountDto[];
};
