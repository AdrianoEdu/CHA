// Copyright (c) 2026-09-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { GetFinancialEntryDto } from "../General";
import { PaginationDto } from "../Pagination/Pagination";
import { CreateReceivedCheckDTO } from "../ReceivedCheck/ReceivedCheck";

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

export interface GetCashBookDTO
  extends Omit<GetFinancialEntryDto, "filePath"> {
  filePath: string | null;
}

export type GetCashBookParamsDto = {
  count: number;
  cashBook: GetCashBookDTO[];
};

export type CashBookWhere = Prisma.CashBookWhereInput;

export type CashBookParams = PaginationDto<CashBookWhere, any, any, any>;
