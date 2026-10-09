// Copyright (c) 2026-04-21
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type ReceivedCheckWithRelations = Prisma.ReceivedCheckGetPayload<{
  select: {
    id: true;
    notes: true;
    amount: true;
    status: true;
    paidAt: true;
    agency: true;
    createdAt: true;
    goodForAt: true;
    updatedAt: true;
    checkNumber: true;
    customer: {
      select: {
        id: true;
        name: true;
        code: true;
        isActive: true;
        numberId: true;
        createdAt: true;
        updatedAt: true;
      };
    };
    bank: {
      select: {
        id: true;
        name: true;
        agencies: true;
        createdAt: true;
        updatedAt: true;
      };
    };
  };
}>;

export const receivedCheckSelect = {
  id: true,
  notes: true,
  status: true,
  amount: true,
  paidAt: true,
  agency: true,
  createdAt: true,
  goodForAt: true,
  updatedAt: true,
  checkNumber: true,
  customer: {
    select: {
      id: true,
      name: true,
      code: true,
      isActive: true,
      numberId: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  bank: {
    select: {
      id: true,
      name: true,
      agencies: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;
