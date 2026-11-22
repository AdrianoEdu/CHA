// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetAccountDto } from "./account.dto";
import { GetCustomerDto } from "./customer.dto";
import { GetFinancialCategoryDto } from "./financial.dto";
import { PaginationDto } from "./pagination.dto";

export type CreateBankStatementDto = {
  value: number;
  title: string;
  accountId: string;
  file?: File | null;
  description: string;
  customerId: string;
  financialCategoryId: string;
};

export type UpdateBankStatementDto = Partial<CreateBankStatementDto> & {
  id: string;
};

export type GetBankStatementDto = {
  id: string;
  filePath?: string;
  value: number;
  title: string;
  createdAt: Date;
  description: string;
  account: GetAccountDto;
  customer: Partial<GetCustomerDto>;
  financialCategory: GetFinancialCategoryDto;
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
