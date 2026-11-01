// Copyright (c) 2026-01-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateEmployeeDto,
  GetEmployeeDtoParams,
  UpdateEmployeeDto,
} from "@/app/api/dto/Employee/Employee";
import { databaseService } from "../../providers/database/DatabaseService";
import { Employee, EmployeePositionEnum, Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { NotFoundException } from "../../error/NotFoundException";
import { EmployeeWithRelations } from "./type";

class EmployeeService {
  private databaseService = databaseService;

  async create(employee: CreateEmployeeDto): Promise<Employee> {
    const employeePosition = await databaseService.employeePosition.findFirst({
      where: { position: employee.employeePositionId as EmployeePositionEnum },
    });

    return this.databaseService.employee.create({
      data: {
        ...employee,
        employeePositionId: employeePosition?.id ?? "",
      },
    });
  }

  async update(id: string, data: Partial<UpdateEmployeeDto>): Promise<void> {
    const employeePosition = await databaseService.employeePosition.findFirst({
      where: { position: data.employeePositionId as EmployeePositionEnum },
    });

    await this.databaseService.employee.update({
      where: { id },
      data: { ...data, employeePositionId: employeePosition?.id },
    });
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
      include: { ...baseQuery.include, employeePosition: true },
    });

    return this.mapEmployee(result);
  }

  async findAll(baseQuery: Prisma.EmployeeFindManyArgs) {
    const result = await this.databaseService.employee.findMany({
      ...baseQuery,
      include: { ...baseQuery.include, employeePosition: true },
    });

    return this.mapEmployee(result);
  }

  async updateStatusUser({
    id,
    name,
    document,
    isActive,
    dateOfBirth,
    employeePositionId,
  }: Partial<UpdateEmployeeDto>) {
    const employeePosition = await databaseService.employeePosition.findFirst({
      where: { position: employeePositionId as EmployeePositionEnum },
    });

    await this.databaseService.employee.update({
      where: { id },
      data: {
        isActive,
        dateOfBirth,
        document,
        name,
        employeePositionId: employeePosition?.id,
      },
    });
  }

  async delete(id?: string): Promise<void> {
    const employee = await this.databaseService.employee.findFirst({
      where: { id },
    });

    if (!employee) throw new NotFoundException();

    await this.databaseService.employee.delete({ where: { id } });
  }

  private async mapEmployee(data: EmployeeWithRelations[]) {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      isActive: item.isActive,
      document: item.document,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      salary: Number(item.salary),
      dateOfBirth: item.dateOfBirth,
      employeePosition: item.employeePosition,
    }));
  }
}

export const employeeService = new EmployeeService();
