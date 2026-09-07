// Copyright (c) 2026-09-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialEntryDto } from "../General";

export type CreateCashBookDto = {
  file?: File;
  value: number;
  title: string;
  description: string;
  accountId: string;
  financialCategoryId: string;
};

export type UpdateCashBookDto = Partial<CreateCashBookDto> & {
  id: string;
};

export type GetCashBookParamsDto = {
  count: number;
  cashBook: GetFinancialEntryDto[];
};
