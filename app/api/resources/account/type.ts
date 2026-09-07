// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type AccountWithRelations = Prisma.AccountGetPayload<{
  select: {
    id: true;
    bank: true;
    balance: true;
    createdAt: true;
    accountType: true;
    accountNumber: true;
  };
}>;
