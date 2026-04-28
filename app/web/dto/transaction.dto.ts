// Copyright (c) 2026-04-25
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialCategoryDto } from "./financial.dto";
import { GetCustomerDto } from "./customer.dto";
import { PaginationDto } from "./pagination.dto";

export type GetTrasnactionDTO = {
  id: string;
  amount: number;
  dueDate?: Date;
  createdAt: Date;
  settledAt?: Date;
  customer: GetCustomerDto;
  category: Partial<GetFinancialCategoryDto>;
};

export type CreateTransactionDTO = {
  dueDate: Date;
  amount: number;
  settledAt?: Date;
  categoryId: string;
  customerId: string;
};

export type UpdateTransactionDTO = {
  id: string;
  dueDate?: Date;
  amount?: number;
  settledAt?: Date;
  categoryId?: string;
  customerId?: string;
  transactionId?: string;
};

export type UpsertTransactionDto = CreateTransactionDTO & UpdateTransactionDTO;

export type TransacitonWhere = Partial<GetTrasnactionDTO>;

export type TransactionParams = PaginationDto<TransacitonWhere, any, any, any>;
