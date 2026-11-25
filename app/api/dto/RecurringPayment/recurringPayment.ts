// Copyright (c) 2026-10-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  BusinessDayAdjustment,
  RecurringPaymentDateType,
} from "@/app/generated/prisma";
import { GetCustomerDto } from "../Customer/Customer";
import { EmployeeDto } from "../Employee/Employee";
import { GetFinancialCategoryDto } from "../FinancialCategory/FinancialCategory";

export type CreateRecurringPaymentDto = {
  name: string;
  dueDay: number;
  employeeId?: string;
  adjustment: BusinessDayAdjustment;
  dueDateType: RecurringPaymentDateType;
};

export type UpdateRecurringPaymentDto = Partial<CreateRecurringPaymentDto> & {
  id: string;
};

export type GetRecurringPaymentDto = {
  id: string;
  name: string;
  dueDay: number | null;
  createdAt: Date;
  updatedAt: Date;
  employee?: EmployeeDto;
  adjustment: BusinessDayAdjustment;
  dueDateType: RecurringPaymentDateType;
};

export type GetRecurringPaymentDtoParams = {
  count: number;
  recurringPayment: GetRecurringPaymentDto[];
};

export type RemoverRecurringPaymentDto = {
  id: string;
};
