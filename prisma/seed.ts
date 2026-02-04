// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PrismaClient } from "@/app/generated/prisma";
import { seedUsers } from './seeds/user-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds...');

  await seedUsers(prisma);

  console.log('✅ Seeds finalizadas');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seeds', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
