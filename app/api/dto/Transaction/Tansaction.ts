// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialCategoryDto } from "../FinancialCategory/FinancialCategory";
import { GetCustomerDto } from "../Customer/Customer";
import { TransactionStatus } from "@/app/generated/prisma";

export type GetTrasnactionDTO = {
  id: string;
  category: GetFinancialCategoryDto;
  amount: number;
  dueDate?: Date;
  createdAt: Date;
  settledAt?: Date;
  currentAmount: number;
  customer: GetCustomerDto;
  status: TransactionStatus;
};

export type CreateTransactionDTO = {
  amount: number;
  dueDate: Date;
  settledAt?: Date;
  categoryId: string;
  customerId: string;
  currentAmount: number;
  status: TransactionStatus;
};

export type UpdateTransactionDTO = {
  id: string;
  dueDate?: Date;
  amount?: number;
  settledAt?: Date;
  categoryId?: string;
  customerId?: string;
  currentAmount?: number;
  status?: TransactionStatus;
};
