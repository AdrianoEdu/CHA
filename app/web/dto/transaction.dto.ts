// Copyright (c) 2026-04-25
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetFinancialCategoryDto } from "./financial.dto";
import { GetCustomerDto } from "./customer.dto";
import { PaginationDto } from "./pagination.dto";
import { TransactionStatus } from "../constants/enum";

export type GetTrasnactionDTO = {
  id: string;
  amount: number;
  dueDate?: Date;
  createdAt: Date;
  settledAt?: Date;
  currentAmount: number;
  customer: GetCustomerDto;
  status: TransactionStatus;
  category: Partial<GetFinancialCategoryDto>;
};

export type CreateTransactionDTO = {
  dueDate: Date;
  amount: number;
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
  transactionId?: string;
  currentAmount?: number;
  status?: TransactionStatus;
};

export type UpsertTransactionDto = CreateTransactionDTO & UpdateTransactionDTO;

export type TransacitonWhere = Partial<GetTrasnactionDTO>;

export type TransactionParams = PaginationDto<TransacitonWhere, any, any, any>;
