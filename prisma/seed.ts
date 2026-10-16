// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PrismaClient } from "@/app/generated/prisma";
import { seedUsers } from "./seeds/user-seed";
import { seedSystemConfig } from "./seeds/config-system-seeds";
import { seedCustomers } from "./seeds/customer-seed";
import { seedBanks } from "./seeds/bank-seed";
import { seedCashBookAccount } from "./seeds/cash-book-account-seed";
import { seedEmployeePosition } from "./seeds/employee-position";
import { seedEmployee } from "./seeds/employee";
import { seedCurrentAccount } from "./seeds/current-account";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seeds...");

  await seedUsers(prisma);
  await seedSystemConfig(prisma);
  await seedCustomers(prisma);
  await seedBanks(prisma);
  await seedCashBookAccount(prisma);
  await seedCurrentAccount(prisma);
  await seedEmployeePosition(prisma);
  await seedEmployee(prisma);

  console.log("✅ Seeds finalizadas");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seeds", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
