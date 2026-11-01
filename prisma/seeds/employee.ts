// Copyright (c) 2026-10-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Employee, EmployeePositionEnum, Prisma } from "@/app/generated/prisma";
import { PrismaClient } from "@prisma/client";

const employeeList: Partial<Employee[]> = [
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "PAULO CESAR DE SOUZA",
    employeePositionId: EmployeePositionEnum.ADMINISTRATIVE_ASSISTANT,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "DEYSE DE CASSIA ZANIN",
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N6,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "ALEX LUIS MOREIRA",
    employeePositionId: EmployeePositionEnum.OFFICE_ASSISTANT,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "REINALDO ODILON FERREIRA",
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N4,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "MARILIA MARTIN SOARES",
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N3,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "JOAO VICTOR DE ASSIS MORAES",
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N2,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "LUCIO DE OLIVEIRA",
    employeePositionId: EmployeePositionEnum.TAX_DEPARTMENT_MANAGER,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "JANAINA DOMINGUES PEREIRA",
    employeePositionId: EmployeePositionEnum.PERSONNEL_DEPARTMENT_ASSISTANT,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "LEONARDO DE SOUZA CIRILO",
    employeePositionId: EmployeePositionEnum.MOTORBOY,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "NATALIA DE FATIMA FERREIRA",
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N5,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "RAIANE MIRELE PEREIRA LIMA",
    employeePositionId: EmployeePositionEnum.PERSONNEL_DEPARTMENT_ASSISTANT,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "GABRIELE ALVES DE OLIVEIRA",
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N3,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "ERICA REZENDE FIGUEIREDO",
    employeePositionId: EmployeePositionEnum.TAX_ASSISTANT_N1,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "AMANDA DE COUTO MUNHOZ",
    employeePositionId: EmployeePositionEnum.OFFICE_ASSISTANT,
    salary: new Prisma.Decimal("0.00"),
  },
  {
    id: "",
    document: "",
    isActive: true,
    updatedAt: null,
    dateOfBirth: null,
    createdAt: new Date(),
    name: "JOYCE ALVES DE OLIVEIRA",
    employeePositionId: EmployeePositionEnum.CLEANING_ASSISTANT,
    salary: new Prisma.Decimal("0.00"),
  },
];

export async function seedEmployee(prisma: PrismaClient) {
  const count = await prisma.employee.count();

  if (count === 0) {
    employeeList.forEach(async (employee) => {
      const employeePosition = await prisma.employeePosition.findUnique({
        where: { position: employee?.employeePositionId },
      });

      await prisma.employee.create({
        data: {
          name: employee?.name,
          salary: employee?.salary,
          document: employee?.document,
          dateOfBirth: employee?.dateOfBirth,
          employeePositionId: employeePosition.id,
        },
      });
    });

    console.log("🏦 Funcionários cadastrados registrados");
  }
}
