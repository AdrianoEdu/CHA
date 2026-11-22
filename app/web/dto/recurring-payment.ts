// Copyright (c) 2026-10-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  BusinessDayAdjustment,
  RecurringPaymentDateType,
} from "../constants/enum";
import { EmployeeDto } from "./employee.dto";
import { PaginationDto } from "./pagination.dto";

export type CreateRecurringPaymentDto = {
  name: string;
  dueDay?: number;
  employeeId?: string;
  adjustment?: BusinessDayAdjustment;
  dueDateType: RecurringPaymentDateType;
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
  employee?: EmployeeDto;
  adjustment: BusinessDayAdjustment;
  dueDateType: RecurringPaymentDateType;
};

export type GetRecurringPaymentDtoParams = {
  count: number;
  recurringPayment: GetRecurringPaymentDto[];
};

export type RecurringPaymentParams = PaginationDto<RecurringPaymentWhere, any, any, any>;

export type RecurringPaymentWhere = Partial<GetRecurringPaymentDto>;


export type RemoverRecurringPaymentDto = {
  id: string;
};
