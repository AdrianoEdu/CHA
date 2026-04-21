// Copyright (c) 2026-03-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeeAdvance, Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import {
  CreateEmployeeAdvanceDto,
  GetEmployeeAdvanceDto,
} from "../../dto/EmployeeAdvance/employeeAdvance";
import { NotFoundException } from "../../error/NotFoundException";
import { connect } from "http2";

class EmployeeAdvanceService {
  private databaseService = databaseService;

  async create({
    employeeId,
    reasonId,
    ...data
  }: CreateEmployeeAdvanceDto): Promise<void> {
    await this.databaseService.employeeAdvance.create({
      data: {
        ...data,
        reason: { connect: { id: reasonId } },
        employee: { connect: { id: employeeId } },
      },
    });
  }

  async update(id: string, data: Partial<GetEmployeeAdvanceDto>) {
    await this.databaseService.employeeAdvance.update({
      where: { id },
      data,
    });
  }

  async findByName({ reasonName }: Partial<GetEmployeeAdvanceDto>) {
    return this.databaseService.employee.findFirst({
      where: { name: reasonName },
    });
  }

  async findMany(
    baseQuery: Prisma.EmployeeAdvanceFindManyArgs,
  ): Promise<GetEmployeeAdvanceDto[]> {
    const result = await this.databaseService.employeeAdvance.findMany({
      ...baseQuery,
    });

    return result.map((data) => this.mapEmployeeAdvance(data));
  }

  async findFirst(
    baseQuery: Prisma.EmployeeAdvanceFindManyArgs,
  ): Promise<GetEmployeeAdvanceDto> {
    const result = await this.databaseService.employeeAdvance.findFirst({
      ...baseQuery,
    });

    if (!result) throw new NotFoundException();

    return this.mapEmployeeAdvance(result);
  }

  async findCheckUsage(
    params: PaginationDto<
      Prisma.EmployeeAdvanceWhereInput,
      Prisma.EmployeeAdvanceSelect,
      Prisma.EmployeeAdvanceInclude,
      Prisma.EmployeeAdvanceOrderByWithRelationInput
    >,
  ): Promise<GetEmployeeAdvanceDto[] | GetEmployeeAdvanceDto> {
    const baseQuery: Prisma.EmployeeAdvanceFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    if (!params.all) return this.findFirst(baseQuery);

    return this.findMany(baseQuery);
  }

  private mapEmployeeAdvance(
    item: EmployeeAdvance & {
      reason?: { name: string } | null;
    },
  ): GetEmployeeAdvanceDto {
    return {
      id: item.id,
      reasonId: item.reasonId,
      createdAt: item.createdAt,
      amount: Number(item.amount),
      employeeId: item.employeeId,
      reasonName: item.reason?.name ?? "",
    };
  }
}

export const exployeeAdvancedService = new EmployeeAdvanceService();
