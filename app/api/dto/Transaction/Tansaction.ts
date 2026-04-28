// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialCategoryDto } from "../FinancialCategory/FinancialCategory";
import { GetCustomerDto } from "../Customer/Customer";

export type GetTrasnactionDTO = {
  id: string;
  category: GetFinancialCategoryDto;
  customer: GetCustomerDto;
  amount: number;
  dueDate?: Date;
  settledAt?: Date;
  createdAt: Date;
};

export type CreateTransactionDTO = {
  categoryId: string;
  customerId: string;
  amount: number;
  dueDate: Date;
  settledAt?: Date;
};

export type UpdateTransactionDTO = {
  id: string;
  dueDate?: Date;
  amount?: number;
  settledAt?: Date;
  categoryId?: string;
  customerId?: string;
};
