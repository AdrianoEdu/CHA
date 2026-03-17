// Copyright (c) 2026-03-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeeAdvance, Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { GetAllEmployeeAdvanceDto } from "../../dto/EmployeeAdvance/employeeAdvance";

class EmployeeAdvanceService {
  private databaseService = databaseService;

  async create(data: GetAllEmployeeAdvanceDto): Promise<void> {
    await this.databaseService.employeeAdvance.create({
      data,
    });
  }

  async update(id: string, data: Partial<GetAllEmployeeAdvanceDto>) {
    await this.databaseService.employeeAdvance.update({
      where: { id },
      data,
    });
  }

  async findByName({ reasonName }: Partial<GetAllEmployeeAdvanceDto>) {
    return this.databaseService.employee.findFirst({
      where: { name: reasonName },
    });
  }

  async findAll(
    params: PaginationDto<
      Prisma.EmployeeAdvanceWhereInput,
      Prisma.EmployeeAdvanceSelect,
      Prisma.EmployeeAdvanceInclude,
      Prisma.EmployeeAdvanceOrderByWithRelationInput
    >,
  ): Promise<GetAllEmployeeAdvanceDto[]> {
    const baseQuery: Prisma.EmployeeAdvanceFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    const result = await this.databaseService.employeeAdvance.findMany({
      ...baseQuery,
      orderBy: { createdAt: "desc" },
      include: { reason: { select: { name: true } } },
    });

    return result.map(({ reason, ...employeeAdvance }) => {
      return {
        id: employeeAdvance.id,
        reasonName: reason.name,
        reasonId: employeeAdvance.reasonId,
        createdAt: employeeAdvance.createdAt,
        amount: Number(employeeAdvance.amount),
        employeeId: employeeAdvance.employeeId,
      };
    });
  }
}

export const exployeeAdvancedService = new EmployeeAdvanceService();
