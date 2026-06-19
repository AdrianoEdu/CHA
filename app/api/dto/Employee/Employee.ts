// Copyright (c) 2026-02-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export interface EmployeeDto {
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export type UpdateEmployeeDto = Partial<EmployeeDto>;

export type GetEmployeeDtoParams = {
  count: number;
  employee: EmployeeDto[];
};
