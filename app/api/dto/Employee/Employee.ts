// Copyright (c) 2026-02-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeePositionEnum } from "@/app/generated/prisma";

export interface CreateEmployeeDto {
  id?: string;
  name: string;
  salary: number;
  document: string;
  dateOfBirth: Date;
  isActive?: boolean;
  employeePositionId: string;
}

export interface EmployeeDto {
  id: string;
  name: string;
  salary: number;
  createdAt: Date;
  document: string;
  isActive: boolean;
  updatedAt?: Date | null;
  dateOfBirth: Date | null;
  employeePosition: EmployeePositionDto;
}

export interface EmployeePositionDto {
  id: string;
  position: EmployeePositionEnum;
}

export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

export type GetEmployeeDtoParams = {
  count: number;
  employee: EmployeeDto[];
};
