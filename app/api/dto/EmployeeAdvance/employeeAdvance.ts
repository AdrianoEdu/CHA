// Copyright (c) 2026-03-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export interface EmployeeAdvanceDto {
  amount: number;
  reasonId: string;
  employeeId: string;
}

export interface GetEmployeeAdvanceDto extends EmployeeAdvanceDto {
  id: string;
  createdAt: Date;
  reasonName: string;
}

export interface CreateEmployeeAdvanceDto extends GetEmployeeAdvanceDto {
  employeeId: string;
  reasonId: string;
}
