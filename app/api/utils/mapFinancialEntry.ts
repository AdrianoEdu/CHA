// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType, Prisma } from "@/app/generated/prisma";
import { GetFinancialEntryDto } from "../dto/General";

type FinancialEntryBase = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  description: string;
  filePath: string | null;

  currentAccount: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    accountNumber: string;
    bankId: string;
    balance: Prisma.Decimal;
  };

  financialCategory: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    financialFlowType: FinancialFlowType;
  };
};

export function mapFinancialEntry<T extends FinancialEntryBase>(
  data: T[],
): GetFinancialEntryDto[] {
  return data.map((entry) => ({
    id: entry.id,
    value: entry.value,
    title: entry.title,
    createdAt: entry.createdAt,
    description: entry.description,
    filePath: entry.filePath ?? "",

    currentAccount: {
      ...entry.currentAccount,
      balance: Number(entry.currentAccount.balance),
    },

    financalCategory: entry.financialCategory,
  }));
}
