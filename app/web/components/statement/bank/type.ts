// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType } from "@/app/web/constants/enum";
import { GetFinancialEntryDto } from "@/app/web/dto/general.dto";

export type FinancialEntryListProps = {
  balanceAccount: number;
  data: GetFinancialEntryDto[];

  onSelect: () => void;
};

export type StyleComponentProps = {
  financialFlowType: FinancialFlowType;
};
