// Copyright (c) 2026-03-20
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionEnum, FinancialFlowType } from "../constants/enum";
import { PaginationDto } from "./pagination.dto";

export type CreateFinancialCategoryDto = {
  name: string;
  financialFlowType: FinancialFlowType;
};

export type UpdateFinancialCategoryDto = Partial<CreateFinancialCategoryDto> & {
  id: string;
};

export type GetFinancialCategoryDto = {
  id: string;
  name: string;
  createdAt: Date;
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
