// Copyright (c) 2026-06-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CreateBankDto, GetBankDto } from "@/app/web/dto/bank.dto";
import { PrismaClient } from "@prisma/client";

const bankList: CreateBankDto[] = [
  {
    createdAt: new Date(),
    name: "Banco do Brasil",
    agencies: ["0368", "8060"],
  },
  {
    name: "Itaú",
    createdAt: new Date(),
    agencies: ["0676", "3135", "5953", "7347"],
  },
  {
    createdAt: new Date(),
    name: "Caixa Econômica Federal",
    agencies: ["0147", "3539", "4537"],
  },
  {
    agencies: [],
    name: "Sicoob",
    createdAt: new Date(),
  },
];

export async function seedBanks(prisma: PrismaClient) {
  const count = await prisma.bank.count();

  if (count === 0) {
    await prisma.bank.createMany({
      data: bankList,
      skipDuplicates: true,
    });

    console.log("🏦 Bancos registrados");
  }
}
