// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { UserRole } from "@/app/generated/prisma";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { login: "admin" },
    update: {
      password: passwordHash, // atualiza se já existir
    },
    create: {
      login: "admin",
      password: passwordHash,
      status: "ACTIVE",
      name: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
    },
  });

  console.log("👤 Usuário admin pronto (bcryptjs)");
}
