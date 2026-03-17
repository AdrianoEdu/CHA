// Copyright (c) 2026-03-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionDto } from "./auth.dto";

export interface EmployeeAdvanceDto {
  amount: number;
  reasonId: string;
  employeeId: string;
}

export interface GetAllEmployeeAdvanceDto extends EmployeeAdvanceDto {
  id: string;
  createdAt: Date;
  reasonName: string;
}

export interface SendEmployeeAdvanceDto
  extends ActionDto, GetAllEmployeeAdvanceDto {}
