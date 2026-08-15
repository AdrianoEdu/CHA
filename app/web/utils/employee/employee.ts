// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CreateEmployeeDto } from "../../dto/employee.dto";

type ValidateEmployeeFormProps = {
  employee: CreateEmployeeDto;
  maxLength: number;
};

export function validateEmployeeForm({
  employee,
  maxLength,
}: ValidateEmployeeFormProps): boolean {
  return (
    !!employee.name?.trim() &&
    !!employee.document?.trim() &&
    !!employee.dateOfBirth &&
    employee.document.length === maxLength
  );
}
