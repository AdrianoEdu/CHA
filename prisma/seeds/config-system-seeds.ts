// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PrismaClient, TokenExpirationUnit } from "@/app/generated/prisma";

export async function seedSystemConfig(prisma: PrismaClient) {
  const systemConfig = await prisma.systemConfig.findFirst();

  if (systemConfig) {
    console.log("⚙️ Configurações do sistema já existem");
    return;
  }

  await prisma.systemConfig.create({
    data: {
      enabled: false,
      intervalHours: 2,
      runAtHour: 0,
      tokenExpirationValue: 2,
      tokenExpirationUnit: TokenExpirationUnit.HOURS,
    },
  });

  console.log("⚙️ Configurações do sistema criadas");
}
