// Copyright (c) 2026-01-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  EmployeeDto,
  GetEmployeeDtoParams,
} from "@/app/api/dto/Employee/Employee";
import { databaseService } from "../../providers/database/DatabaseService";
import { Employee, Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { NotFoundException } from "../../error/NotFoundException";

class EmployeeService {
  private databaseService = databaseService;

  async create(employee: EmployeeDto): Promise<Employee> {
    return this.databaseService.employee.create({ data: employee });
  }

  async update(id: string, data: Partial<EmployeeDto>): Promise<void> {
    await this.databaseService.employee.update({ where: { id }, data });
  }

  async findEmployee(
    params: PaginationDto<
      Prisma.EmployeeWhereInput,
      Prisma.EmployeeSelect,
      Prisma.EmployeeInclude,
      Prisma.EmployeeOrderByWithRelationInput
    >,
  ): Promise<GetEmployeeDtoParams> {
    const baseQuery: Prisma.EmployeeFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    const count = await this.databaseService.employee.count({
      where: baseQuery.where,
    });

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    if (params.where)
      return { count, employee: await this.findManyByFilters(baseQuery) };

    return { count, employee: await this.findAll(baseQuery) };
  }

  async findManyByFilters(baseQuery: Prisma.EmployeeFindManyArgs) {
    const result = await this.databaseService.employee.findMany({
      ...baseQuery,
    });

    return result;
  }

  async findAll(baseQuery: Prisma.EmployeeFindManyArgs) {
    return await this.databaseService.employee.findMany({
      ...baseQuery,
      where: undefined,
    });
  }

  async updateStatusUser({ isActive, id }: Partial<EmployeeDto>) {
    await this.databaseService.employee.update({
      where: { id },
      data: { isActive },
    });
  }

  async delete(id?: string): Promise<void> {
    const employee = await this.databaseService.employee.findFirst({
      where: { id },
    });

    if (!employee) throw new NotFoundException();

    await this.databaseService.employee.delete({ where: { id } });
  }
}

export const employeeService = new EmployeeService();
