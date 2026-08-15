// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetCurrentAccountDto } from "../CurrentAccount/CurrentAccount";
import { GetFinancialCategoryDto } from "../FinancialCategory/FinancialCategory";

export type CreateBankStatementDto = {
  value: number;
  createdAt: Date;
  title: string;
  filePath: string;
  description: string;
  currentAccountId: string;
  financialCategoryId: string;
};

export type UpdateBankStatementDto = Partial<CreateBankStatementDto> & {
  id: string;
};

export type GetBankStatementDto = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  filePath: string;
  description: string;
  currentAccount: GetCurrentAccountDto;
  financalCategory: GetFinancialCategoryDto;
};

export type GetBankStatementParamsDto = {
  count: number;
  bankStatement: GetBankStatementDto[];
};
