// Copyright (c) 2026-10-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetCustomerDto } from "./customer.dto";
import { EmployeeDto } from "./employee.dto";
import { GetFinancialCategoryDto } from "./financial.dto";
import { PaginationDto } from "./pagination.dto";

export type CreateRecurringPaymentDto = {
  name: string;
  dueDay: number;
  isMonthly: boolean;
  employeeId?: string;
  customerId?: string;
  fixedAmount?: number;
  isFixedAmount: boolean;
  financialCategoryId: string;
};

export type UpdateRecurringPaymentDto = Partial<CreateRecurringPaymentDto> & {
  id: string;
};

export type GetRecurringPaymentDto = {
  id: string;
  name: string;
  dueDay: number;
  createdAt: Date;
  updatedAt: Date;
  isMonthly: boolean;
  fixedAmount?: number;
  isFixedAmount: boolean;
  employee?: EmployeeDto;
  customer?: GetCustomerDto;
  financialCategory: GetFinancialCategoryDto;
};

export type RecurringPaymentWhere = Partial<GetRecurringPaymentDto>;

export type RecurringPaymentParams = PaginationDto<
  RecurringPaymentWhere,
  any,
  any,
  any
>;

export type GetRecurringPaymentDtoParams = {
  count: number;
  recurringPayment: GetRecurringPaymentDto[];
};

export type RemoverRecurringPaymentDto = {
  id: string;
};
