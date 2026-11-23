// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type ReceivedCheckWithRelations =
  Prisma.ReceivedCheckGetPayload<{
    include: {
      bank: true;
      customer: true;
    };
  }>;