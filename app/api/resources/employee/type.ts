// Copyright (c) 2026-11-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";

export type EmployeeWithRelations = Prisma.EmployeeGetPayload<{
  select: {
    id: true;
    name: true;
    salary: true;
    isActive: true;
    document: true;
    createdAt: true;
    updatedAt: true;
    dateOfBirth: true;
    employeePosition: true;
  };
}>;
