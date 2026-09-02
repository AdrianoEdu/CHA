// Copyright (c) 2026-09-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CreateCurrentAccountDto } from "@/app/api/dto/CurrentAccount/CurrentAccount";
import { PrismaClient } from "@prisma/client";

const createCashBookAccount: CreateCurrentAccountDto = {
  bankId: "",
  balance: 0,
  accountNumber: "",
  createdAt: new Date(),
};

export async function seedCashBookAccount(prisma: PrismaClient) {
  const count = await prisma.bank.count();

  if (count === 0) {
    await prisma.currentAccount.create({
      data: createCashBookAccount,
      skipDuplicates: true,
    });

    console.log("📚  Livro caixa registrado");
  }
}
