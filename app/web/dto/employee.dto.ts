// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeePositionEnum } from "../constants/enum";
import { PaginationDto } from "./pagination.dto";

export interface EmployeeDto {
  id?: string;
  name: string;
  document: string;
  createdAt?: Date;
  updatedAt?: Date;
  dateOfBirth: Date;
  isActive?: boolean;
  employeePosition: EmployeePoistionDto;
}

export interface EmployeePoistionDto {
  id: string;
  position: EmployeePositionEnum;
}

export interface CreateEmployeeDto {
  name: string;
  document: string;
  dateOfBirth: Date;
  employeePositionId: string;
}

export interface UpdateEmployeeDto {
  id: string;
  name: string;
  document: string;
  dateOfBirth: Date;
  isActive?: boolean;
  employeePositionId: string;
}

export type EmployeeWhere = Partial<EmployeeDto>;

export type EmployeeParams = PaginationDto<EmployeeWhere, any, any, any>;

export type GetEmployeeDtoParams = {
  count: number;
  employee: EmployeeDto[];
};
