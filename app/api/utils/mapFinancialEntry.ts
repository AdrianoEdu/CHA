// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType, FinancialFlowType, Prisma } from "@/app/generated/prisma";
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