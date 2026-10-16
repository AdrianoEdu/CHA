// Copyright (c) 2026-10-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeePositionEnum } from "@/app/generated/prisma";
import { PrismaClient } from "@prisma/client";

export async function seedEmployeePosition(prisma: PrismaClient) {
  const count = await prisma.employeePosition.count();

  if (count === 0) {
    const positions = Object.values(EmployeePositionEnum);

    await prisma.employeePosition.createMany({
      data: positions.map((position) => ({
        position: position,
      })),
      skipDuplicates: true,
    });

    console.log("🏦 Cargos registrados");
  }
}
