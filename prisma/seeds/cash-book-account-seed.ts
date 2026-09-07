// Copyright (c) 2026-09-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CreateAccountDto } from "@/app/api/dto/Account/Account";
import { AccountType } from "@/app/generated/prisma";
import { PrismaClient } from "@prisma/client";

const createCashBookAccount: CreateAccountDto = {
  balance: 0,
  accountNumber: "",
  createdAt: new Date(),
};

export async function seedCashBookAccount(prisma: PrismaClient) {
  const count = await prisma.account.count();

  if (count === 0) {
    await prisma.account.create({
      data: {
        ...createCashBookAccount,
        accountType: AccountType.CASHBOOK,
      },
    });

    console.log("📚  Livro caixa registrado");
  }
}
