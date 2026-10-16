// Copyright (c) 2026-10-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType } from "@/app/generated/prisma";
import { CreateAccountDto } from "@/app/web/dto/account.dto";
import { PrismaClient } from "@prisma/client";

const data: CreateAccountDto[] = [
  {
    balance: 0,
    bankId: "Itaú",
    createdAt: new Date(),
    accountNumber: "341/0676/66646-4",
  },
  {
    balance: 0,
    bankId: "Caixa Econômica Federal",
    createdAt: new Date(),
    accountNumber: "104/0147/501319-9",
  },
];

export async function seedCurrentAccount(prisma: PrismaClient) {
  const count = await prisma.account.count({
    where: {
      accountType: AccountType.BANK,
    },
  });

  if (count === 0) {
    for (const item of data) {
      const bank = await prisma.bank.findFirst({
        where: {
          name: item.bankId,
        },
      });

      if (!bank) {
        throw new Error(`Banco não encontrado: ${item.bankId}`);
      }

      await prisma.account.create({
        data: {
          ...item,
          bankId: bank.id,
        },
      });
    }

    console.log("🏦 Contas bancárias registradas");
  }
}
