// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType } from "@/app/generated/prisma";

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
