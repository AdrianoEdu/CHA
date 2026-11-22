// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetAccountDto } from "./account.dto";
import { GetCustomerDto } from "./customer.dto";
import { GetFinancialCategoryDto } from "./financial.dto";

export type GetFinancialEntryDto = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  filePath?: string;
  description: string;
  account: GetAccountDto;
  customer: Partial<GetCustomerDto>;
  financialCategory: GetFinancialCategoryDto;
};

export type CreateFinancialEntryDto = {
  value: number;
  title: string;
  accountId: string;
  file?: File | null;
  customerId: string;
  description: string;
  financialCategoryId: string;
};

export type UpdateFinancialEntryDto = Partial<CreateFinancialEntryDto> & {
  id: string;
};
