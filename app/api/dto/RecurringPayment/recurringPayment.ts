// Copyright (c) 2026-10-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetCustomerDto } from "../Customer/Customer";
import { EmployeeDto } from "../Employee/Employee";
import { GetFinancialCategoryDto } from "../FinancialCategory/FinancialCategory";

export type CreateRecurringPaymentDto = {
  name: string;
  dueDay: number;
  isMonthly: boolean;
  customerId?: string;
  employeeId?: string;
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

export type GetRecurringPaymentDtoParams = {
  count: number;
  recurringPayment: GetRecurringPaymentDto[];
};

export type RemoverRecurringPaymentDto = {
  id: string;
};
