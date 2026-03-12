// Copyright (c) 2026-01-31
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { employeeService } from "./employee-service";
import { EmployeeDto } from "../../dto/Employee/Employee";

export class EmployeeController {
  private employeeService;

  constructor() {
    this.employeeService = employeeService;
  }

  async create(decryptedBody: any) {
    try {
      const employee = await this.employeeService.create(decryptedBody);
      return Response.json(employee, { status: 201 });
    } catch (error: any) {
      console.error("Erro ao criar Employee:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async update(id: string, decryptedBody: any) {
    try {
      await this.employeeService.update(id, decryptedBody);
      return Response.json(
        { message: "Employee atualizado com sucesso" },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Erro ao atualizar Employee:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findAll(
    params: PaginationDto<
      Prisma.EmployeeWhereInput,
      Prisma.EmployeeSelect,
      Prisma.EmployeeInclude,
      Prisma.EmployeeOrderByWithRelationInput
    >,
  ) {
    try {
      const employees = await this.employeeService.findAll(params);
      return employees;
    } catch (error: any) {
      console.error("Erro ao buscar Employees:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async patch({ isActive, id }: Partial<EmployeeDto>) {
    await this.employeeService.updateStatusUser({ isActive, id });
  }

  async delete({ id }: Partial<EmployeeDto>): Promise<void> {
    await this.employeeService.delete(id);
  }
}
