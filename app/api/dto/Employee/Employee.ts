// Copyright (c) 2026-02-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeePositionEnum } from "@/app/generated/prisma";

export interface CreateEmployeeDto {
  id?: string;
  name: string;
  document: string;
  createdAt?: Date;
  dateOfBirth: Date;
  isActive?: boolean;
  updatedAt?: Date | null;
  employeePositionId: string;
}

export interface EmployeeDto {
  id: string;
  name: string;
  document: string;
  createdAt: Date;
  dateOfBirth: Date | null;
  isActive: boolean;
  updatedAt?: Date | null;
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
