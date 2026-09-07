// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialEntryDto } from "./general.dto";
import { PaginationDto } from "./pagination.dto";

export type CreateCashBookDto = {
  value: number;
  title: string;
  accountId: string;
  file?: File | null;
  description: string;
  financialCategoryId: string;
};

export type UpdateCashBookDto = Partial<CreateCashBookDto> & {
  id: string;
};

export type CashBookWhere = Partial<GetFinancialEntryDto>;

export type CashBookParams = PaginationDto<CashBookWhere, any, any, any>;

export type GetCashBookParamsDto = {
  count: number;
  cashBook: GetFinancialEntryDto[];
};
