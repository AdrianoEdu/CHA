// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetAccountDto } from "./Account/Account";
import { GetFinancialCategoryDto } from "./FinancialCategory/FinancialCategory";

export type GetFinancialEntryDto = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  filePath?: string;
  description: string;
  account: GetAccountDto;
  financialCategory: GetFinancialCategoryDto;
};
