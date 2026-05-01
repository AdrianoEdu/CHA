// services/DatabaseService.ts
// Creation Date: 2026-01-20
// Author: Adriano Eduardo Trentin Júnior
// Copyright © 2026 VWTB
// All rights reserved.

import { PrismaClient } from "@/app/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const databaseService =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = databaseService;
}
