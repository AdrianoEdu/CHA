// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetCurrentAccountDto } from "./current-accont.dto";
import { GetFinancialCategoryDto } from "./financial.dto";
import { PaginationDto } from "./pagination.dto";

export type CreateBankStatementDto = {
  value: number;
  createdAt: Date;
  currentAccountId: string;
  financialCategoryId: string;
};

export type UpdateBankStatementDto = Partial<CreateBankStatementDto> & {
  id: string;
};

export type GetBankStatementDto = {
  id: string;
  value: number;
  createdAt: Date;
  currentAccount: GetCurrentAccountDto;
  financalCategory: GetFinancialCategoryDto;
};

export type BankStatementWhere = Partial<GetBankStatementDto>;

export type BankStatementParams = PaginationDto<
  BankStatementWhere,
  any,
  any,
  any
>;

export type GetBankStatementParamsDto = {
  count: number;
  bankStatement: GetBankStatementDto[];
};
