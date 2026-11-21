// Copyright (c) 2026-03-20
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType, ActionEnum, FinancialFlowType } from "../constants/enum";
import { PaginationDto } from "./pagination.dto";

export type CreateFinancialCategoryDto = {
  name: string;
  accountType: AccountType;
  financialFlowType: FinancialFlowType;
};

export type UpdateFinancialCategoryDto = Partial<CreateFinancialCategoryDto> & {
  id: string;
  accountType?: AccountType;
};

export type GetFinancialCategoryDto = {
  id: string;
  name: string;
  createdAt: Date;
  accountType: AccountType;
  financialFlowType: FinancialFlowType;
};

export type SendFinancialCategoryDto = UpdateFinancialCategoryDto & {
  type: ActionEnum;
};

export type FinancialCategoryWhere = Partial<GetFinancialCategoryDto>;

export type FinancialCategoryParams = PaginationDto<
  FinancialCategoryWhere,
  any,
  any,
  any
>;

export type GetFinancialCategoryParamsDto = {
  count: number;
  financialCategories: GetFinancialCategoryDto[];
};
