// Copyright (c) 2026-01-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeeDto } from "@/app/api/dto/Employee/Employee";
import { databaseService } from "../../providers/database/DatabaseService";
import { Employee, Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";

class EmployeeService {
  private databaseService = databaseService;

  async create(employee: EmployeeDto): Promise<Employee> {
    return this.databaseService.employee.create({ data: employee });
  }

  async update(id: string, data: Partial<EmployeeDto>): Promise<void> {
    await this.databaseService.employee.update({ where: { id }, data });
  }

  async findAll(
    params: PaginationDto<
      Prisma.EmployeeWhereInput,
      Prisma.EmployeeSelect,
      Prisma.EmployeeInclude,
      Prisma.EmployeeOrderByWithRelationInput
    >,
  ): Promise<Employee[]> {
    const baseQuery: Prisma.EmployeeFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    return await this.databaseService.employee.findMany({
      ...baseQuery,
      orderBy: { createdAt: "desc" },
    });
  }
}

export const employeeService = new EmployeeService();
