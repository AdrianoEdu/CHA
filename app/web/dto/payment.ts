// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetCustomerDto } from "./customer.dto";
import { EmployeeDto } from "./employee.dto";
import { GetFinancialCategoryDto } from "./financial.dto";
import { PaginationDto } from "./pagination.dto";
import { GetRecurringPaymentDto } from "./recurring-payment";

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
  referenceMonth: Date | null;

  employee?: EmployeeDto;
  customer?: GetCustomerDto;
  recurringPayment?: GetRecurringPaymentDto;
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

export type PaymentParams = PaginationDto<PaymentWhere, any, any, any>;
