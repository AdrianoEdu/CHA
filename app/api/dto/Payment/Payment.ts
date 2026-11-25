// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { GetCustomerDto } from "../Customer/Customer";
import { EmployeeDto } from "../Employee/Employee";
import { GetFinancialCategoryDto } from "../FinancialCategory/FinancialCategory";
import { PaginationDto } from "../Pagination/Pagination";
import { GetRecurringPaymentDto } from "../RecurringPayment/recurringPayment";

export type CreatePaymentDto = {
  name: string;
  dueDate: Date;
  paidAt?: Date;
  amount: number;
  employeeId?: string;
  customerId?: string;
  referenceMonth?: Date;
  recurringPaymentId?: string;
  financialCategoryId: string;
};

export type UpdatePaymentDto = Partial<CreatePaymentDto> & {
  id: string;
};

export type GetPaymentDto = {
  id: string;
  name: string;
  dueDate: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date | null;

  employee?: Partial<EmployeeDto> | null;
  customer?: Partial<GetCustomerDto> | null;
  recurringPayment?: Partial<GetRecurringPaymentDto> | null;
  financialCategory: GetFinancialCategoryDto;
};

export type GetPaymentDtoParams = {
  count: number;
  payment: GetPaymentDto[];
};

export type RemoverPaymentDto = {
  id: string;
};

export type PaymentWhere = Partial<GetPaymentDto>;

export type PaymentParams = PaginationDto<
  PaymentWhere,
  Prisma.PaymentSelect,
  Prisma.PaymentInclude,
  Prisma.PaymentOrderByWithRelationInput
>;