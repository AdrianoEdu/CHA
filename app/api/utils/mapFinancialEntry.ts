// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType, FinancialFlowType, Prisma } from "@/app/generated/prisma";
import { GetBankDto } from "../dto/Bank/bank";
import { GetFinancialEntryDto } from "../dto/General";

type FinancialEntryBase = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  description: string;
  filePath: string | null;

  account?: {
    id: string;
    createdAt: Date;
    balance: Prisma.Decimal;
    accountType: AccountType;
    accountNumber: string | null;
    bankId: string | null;
    bank: GetBankDto | null;
  };

  financialCategory?: {
    id: string;
    name: string;
    financialFlowType: FinancialFlowType;
    accountType: AccountType;
    createdAt: Date;
    updatedAt: Date;
  };

  customer: {
    id: string;
    name: string;
  } | null;
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
    customer: {
      id: entry?.customer?.id,
      name: entry?.customer?.name
    },

    ...(entry.account && {
      account: {
        id: entry.account.id,
        createdAt: entry.account.createdAt,
        balance: Number(entry.account.balance),
        accountType: entry.account.accountType,
        accountNumber: entry.account.accountNumber,
        bankId: entry.account.bankId,
        bank: entry.account.bank ?? null,
      },
    }),

    ...(entry.financialCategory && {
      financialCategory: {
        id: entry.financialCategory.id,
        name: entry.financialCategory.name,
        financialFlowType: entry.financialCategory.financialFlowType,
        accountType: entry.financialCategory.accountType,
        createdAt: entry.financialCategory.createdAt,
        updatedAt: entry.financialCategory.updatedAt,
      },
    }),
  }));
}