// Copyright (c) 2026-04-24
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  select: {
    id: true;
    type: true;
    amount: true;
    dueDate: true;
    customer: true;
    category: true;
    settledAt: true;
    createdAt: true;
  };
}>;

export const transactionSelect = {
  id: true,
  type: true,
  amount: true,
  dueDate: true,
  category: true,
  customer: true,
  settledAt: true,
  createdAt: true,
};
