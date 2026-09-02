// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetCurrentAccountDto } from "./CurrentAccount/CurrentAccount";
import { GetFinancialCategoryDto } from "./FinancialCategory/FinancialCategory";

export type GetFinancialEntryDto = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  filePath: string;
  description: string;
  currentAccount: GetCurrentAccountDto;
  financalCategory: GetFinancialCategoryDto;
};
