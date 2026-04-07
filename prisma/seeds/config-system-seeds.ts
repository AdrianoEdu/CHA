// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PrismaClient } from "@prisma/client";

export async function seedSystemConfig(prisma: PrismaClient) {
  await prisma.systemConfig.upsert({
    where: { id: "" },
    update: {},
    create: {
      enabled: false,
    },
  });

  console.log("👤 Configurações do sistema seedados");
}
