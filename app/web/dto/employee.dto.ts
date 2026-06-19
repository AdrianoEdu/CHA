// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PaginationDto } from "./pagination.dto";

export interface EmployeeDto {
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type EmployeeWhere = Partial<EmployeeDto>;

export type EmployeeParams = PaginationDto<EmployeeWhere, any, any, any>;

export type GetEmployeeDtoParams = {
  count: number;
  employee: EmployeeDto[];
};
