
// Copyright (c) 2026-10-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeePositionEnum, Prisma } from "@/app/generated/prisma";
import { PrismaClient } from "@prisma/client";

type EmployeeSeed = {
  name: string;
  document: string;
  isActive: boolean;
  dateOfBirth: Date | null;
  salary: number;
  employeePositionId: EmployeePositionEnum;
};

const employeeList: EmployeeSeed[] = [
  {
    name: "PAULO CESAR DE SOUZA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.ADMINISTRATIVE_ASSISTANT,
  },
  {
    name: "DEYSE DE CASSIA ZANIN",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N6,
  },
  {
    name: "ALEX LUIS MOREIRA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.OFFICE_ASSISTANT,
  },
  {
    name: "REINALDO ODILON FERREIRA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N4,
  },
  {
    name: "MARILIA MARTIN SOARES",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N3,
  },
  {
    name: "JOAO VICTOR DE ASSIS MORAES",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N2,
  },
  {
    name: "LUCIO DE OLIVEIRA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_DEPARTMENT_MANAGER,
  },
  {
    name: "JANAINA DOMINGUES PEREIRA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.PERSONNEL_DEPARTMENT_ASSISTANT,
  },
  {
    name: "LEONARDO DE SOUZA CIRILO",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.MOTORBOY,
  },
  {
    name: "NATALIA DE FATIMA FERREIRA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N5,
  },
  {
    name: "RAIANE MIRELE PEREIRA LIMA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.PERSONNEL_DEPARTMENT_ASSISTANT,
  },
  {
    name: "GABRIELE ALVES DE OLIVEIRA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N3,
  },
  {
    name: "ERICA REZENDE FIGUEIREDO",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N1,
  },
  {
    name: "AMANDA DE COUTO MUNHOZ",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.OFFICE_ASSISTANT,
  },
  {
    name: "JOYCE ALVES DE OLIVEIRA",
    document: "",
    isActive: true,
    dateOfBirth: null,
    salary: 0,
    employeePositionId: EmployeePositionEnum.CLEANING_ASSISTANT,
  },
];

export async function seedEmployee(prisma: PrismaClient) {
  const count = await prisma.employee.count();

  if (count > 0) return;

  for (const employee of employeeList) {
    const employeePosition = await prisma.employeePosition.findFirst({
      where: { position: employee.employeePositionId },
    });

    if (!employeePosition) {
      throw new Error(
        `Cargo não encontrado: ${employee.employeePositionId}`,
      );
    }

    await prisma.employee.create({
      data: {
        name: employee.name,
        document: employee.document,
        isActive: employee.isActive,
        dateOfBirth: employee.dateOfBirth,
        salary: new Prisma.Decimal(employee.salary),
        employeePositionId: employeePosition.id,
      },
    });
  }

  console.log("🏦 Funcionários cadastrados registrados");
}
