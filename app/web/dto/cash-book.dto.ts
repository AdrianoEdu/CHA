// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialEntryDto } from "./general.dto";
import { PaginationDto } from "./pagination.dto";
import { CreateReceivedCheckDTO } from "./receive-check.dto";

export type CreateCashBookDto = {
  file?: File;
  value: number;
  title: string;
  accountId: string;
  customerId: string;
  description: string;
  financialCategoryId: string;
  receivedCheckIds?: string[];
  receivedCheck?: CreateReceivedCheckDTO;
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
