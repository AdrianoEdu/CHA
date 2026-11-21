// Copyright (c) 2026-11-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType, FinancialFlowType } from "@/app/web/constants/enum";
import { CreateFinancialCategoryDto } from "@/app/web/dto/financial.dto";
import { PrismaClient } from "@prisma/client";

const result: CreateFinancialCategoryDto[] = [
  {
    name: "Recebimento por pix",
    accountType: AccountType.BANK,
    financialFlowType: FinancialFlowType.IN,
  },
  {
    name: "Pagamento por pix",
    accountType: AccountType.BANK,
    financialFlowType: FinancialFlowType.OUT,
  },
  {
    name: "Pagamento por transação TED",
    accountType: AccountType.BANK,
    financialFlowType: FinancialFlowType.OUT,
  },
  {
    name: "Recebimento por transação TED",
    accountType: AccountType.BANK,
    financialFlowType: FinancialFlowType.IN,
  },
  {
    name: "Pagamento por cheque",
    accountType: AccountType.BANK,
    financialFlowType: FinancialFlowType.OUT,
  },
  {
    name: "Pagamento com cheque de terceiro",
    accountType: AccountType.CASHBOOK,
    financialFlowType: FinancialFlowType.OUT,
  },
  {
    name: "Recebimento de cheque de terceiro",
    accountType: AccountType.CASHBOOK,
    financialFlowType: FinancialFlowType.IN,
  },
  {
    name: "Recebimento de dinheiro",
    accountType: AccountType.CASHBOOK,
    financialFlowType: FinancialFlowType.IN,
  },
  {
    name: "Pagamento com dinheiro",
    accountType: AccountType.CASHBOOK,
    financialFlowType: FinancialFlowType.OUT,
  },
];

export async function seedFinancialCategory(prisma: PrismaClient) {
  let created = 0;

  for (const category of result) {
    const existing = await prisma.financialCategory.findFirst({
      where: {
        name: category.name,
        accountType: category.accountType,
        financialFlowType: category.financialFlowType,
      },
    });

    if (existing) continue;

    await prisma.financialCategory.create({
      data: category,
    });

    created++;
  }

  console.log(`💰 Categorias financeiras cadastradas: ${created}`);
}
