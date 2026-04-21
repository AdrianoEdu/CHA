// Copyright (c) 2026-03-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionDto } from "./auth.dto";
import { PaginationDto } from "./pagination.dto";

export interface CreateEmployeeAdvanceDto {
  amount: number;
  reasonId: string;
  employeeId: string;
}

export interface GetAllEmployeeAdvanceDto {
  id: string;
  amount: number;
  createdAt: Date;
  reasonName: string;
}

export interface UpdateEmployeeAdvanveDto {
  id: string;
  amount?: number;
  reasonId?: string;
  employeeId?: string;
  reasonName?: string;
}

export interface SendEmployeeAdvanceDto
  extends ActionDto, GetAllEmployeeAdvanceDto {}

export type EmployeeAdvanceWhere = Partial<GetAllEmployeeAdvanceDto>;

export type EmployeeAdvanceParams = PaginationDto<
  EmployeeAdvanceWhere,
  any,
  any,
  any
>;
