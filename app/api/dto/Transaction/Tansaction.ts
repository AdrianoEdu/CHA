// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { TransactionType } from "@/app/generated/prisma";
import { GetFinancialCategoryDto } from "../FinancialCategory/FinancialCategory";
import { GetCustomerDto } from "../Customer/Customer";

export type TrasnactionDTO = {
  id: string;
  type: TransactionType;
  category: GetFinancialCategoryDto;
  customer: GetCustomerDto;
  amount: number;
  dueDate?: Date;
  settledAt?: Date;
  createdAt: Date;
};

export type CreateTransactionDTO = {
  type: TransactionType;
  categoryId: string;
  customerId: string;
  amount: number;
  dueDate: Date;
  settLedAt?: Date;
};

export type UpdateTransactionDTO = {
  id: string;
  dueDate?: Date;
  amount?: number;
  settLedAt?: Date;
  categoryId?: string;
  customerId?: string;
  type?: TransactionType;
};
