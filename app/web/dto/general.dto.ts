// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetCurrentAccountDto } from "./current-accont.dto";
import { GetFinancialCategoryDto } from "./financial.dto";

export type GetFinancialEntryDto = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  filePath?: string;
  description: string;
  currentAccount: GetCurrentAccountDto;
  financialCategory: GetFinancialCategoryDto;
};

export type CreateFinancialEntryDto = {
  value: number;
  title: string;
  file?: File | null;
  description: string;
  currentAccountId: string;
  financialCategoryId: string;
};

export type UpdateFinancialEntryDto = Partial<CreateFinancialEntryDto> & {
  id: string;
};
