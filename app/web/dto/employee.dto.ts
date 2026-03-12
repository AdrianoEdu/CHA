// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionDto } from "./auth.dto";

export interface EmployeeDto {
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SendEmployeeDto extends ActionDto, EmployeeDto {}
