// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType, FinancialFlowType, Prisma } from "@/app/generated/prisma";
import { GetFinancialEntryDto } from "../dto/General";
import { GetBankDto } from "../dto/Bank/bank";

type FinancialEntryBase = {
  id: string;
  value: number;
  title: string;
  createdAt: Date;
  description: string;
  filePath: string | null;

  account: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    bankId: string | null;
    bank?: GetBankDto | null; // 👈 opcional
    balance: Prisma.Decimal;
    accountType: AccountType;
    accountNumber: string | null;
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

    account: {
      id: entry.account.id,
      createdAt: entry.account.createdAt,
      balance: Number(entry.account.balance),
      accountType: entry.account.accountType,
      accountNumber: entry.account.accountNumber,
      bankId: entry.account.bankId,
      bank: entry.account.bank ?? null,
    },

    financialCategory: entry.financialCategory,
  }));
}
