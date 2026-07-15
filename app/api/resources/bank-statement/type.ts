// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type BankStatemenrtWithRelations = Prisma.BankStatementGetPayload<{
  select: {
    id: true;
    value: true;
    createdAt: true;
    currentAccount: true;
    financialCategory: true;
  };
}>;

export const bankStatementSelect = {
  select: {
    id: true,
    value: true,
    createdAt: true,
    currentAccount: true,
    financialCategory: true,
  },
};
