// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeePositionEnum } from "../../constants/enum";
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

export const GetEmployeePosition: Record<EmployeePositionEnum, string> = {
  ADMINISTRATIVE_ASSISTANT: "ASSISTENTE ADMINISTRATIVO",
  CLEANING_ASSISTANT: "AUXILIAR DE LIMPEZA",
  MOTORBOY: "MOTOBOY",
  OFFICE_ASSISTANT: "AUXILIAR DE ESCRITÓRIO",
  PERSONNEL_DEPARTMENT_ASSISTANT: "ASSISTENTE DE DEPARTAMENTO PESSOAL",
  PERSONNEL_DEPARTMENT_MANAGER: "eNCARREGADO DE DEPARTAMENTO PESSOAL",
  TAX_ASSISTANT_N1: "AUXILIAR DE FISCAL N1",
  TAX_ASSISTANT_N2: "AUXILIAR DE FISCAL N2",
  TAX_ASSISTANT_N3: "AUXILIAR DE FISCAL N3",
  TAX_ASSISTANT_N4: "AUXILIAR DE FISCAL N4",
  TAX_ASSISTANT_N5: "AUXILIAR DE FISCAL N5",
  TAX_ASSISTANT_N6: "AUXILIAR DE FISCAL N6",
  TAX_DEPARTMENT_MANAGER: "ENCARREGADO DE DEPARTAMENTO FISCAL",
};
