// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialEntryDto } from "../General";

export type CreateBankStatementDto = {
  file: File;
  title: string;
  value: number;
  createdAt: Date;
  description: string;
  accountId: string;
  financialCategoryId: string;
};

export type UpdateBankStatementDto = Partial<CreateBankStatementDto> & {
  id: string;
};

export type GetBankStatementParamsDto = {
  count: number;
  bankStatement: GetFinancialEntryDto[];
};
