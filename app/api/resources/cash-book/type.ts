// Copyright (c) 2026-11-23
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Eduardo Trentin Junior.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type CashBookWithRelations = Prisma.CashBookGetPayload<{
  include: {
    account: {
      select: {
        balance: true;
      };
    };
    financialCategory: true;
  };
}>;