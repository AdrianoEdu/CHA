// Copyright (c) 2026-04-21
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type ReceivedCheckWithRelations = Prisma.ReceivedCheckGetPayload<{
  select: {
    id: true;
    agency: true;
    status: true;
    createdAt: true;
    goodForAt: true;
    checkNumber: true;
    totalAmount: true;
    currentAmount: true;
    customer: {
      select: {
        id: true;
        name: true;
        code: true;
        customerType: true;
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
  agency: true,
  status: true,
  createdAt: true,
  goodForAt: true,
  checkNumber: true,
  totalAmount: true,
  currentAmount: true,
  customer: {
    select: {
      id: true,
      name: true,
      code: true,
      customerType: true,
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
