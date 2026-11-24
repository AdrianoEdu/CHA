// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetAccountDto } from "./Account/Account";
import { GetCustomerDto } from "./Customer/Customer";
import { GetFinancialCategoryDto } from "./FinancialCategory/FinancialCategory";

export type GetFinancialEntryDto = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  filePath?: string;
  description: string;
  account?: GetAccountDto;
  customer?: Partial<GetCustomerDto> | null,
  financialCategory?: GetFinancialCategoryDto;
};
