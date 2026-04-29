// Copyright (c) 2026-04-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type CheckUsageWithRelations = Prisma.CheckUsageGetPayload<{
  select: {
    id: true;
    notes: true;
    usedAt: true;
    amount: true;
    createdAt: true;
    usageType: true;
    receivedCheck: {
      include: { bank: true; customer: true };
    };
    transaction: {
      select: { amount: true; id: true; currentAmount: true };
    };
  };
}>;

export const checkUsageSelect = {
  id: true,
  notes: true,
  usedAt: true,
  amount: true,
  createdAt: true,
  usageType: true,
  receivedCheck: {
    include: { bank: true, customer: true },
  },
  transaction: {
    select: { amount: true, id: true, currentAmount: true },
  },
};
