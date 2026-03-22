// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateFinancialCategoryDto,
  GetFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "../../dto/FinancialCategory/FinancialCategory";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";

class FinancialCategoryService {
  private databaseService;

  constructor() {
    this.databaseService = databaseService;
  }

  async create(data: CreateFinancialCategoryDto) {
    return this.databaseService.financialCategory.create({ data });
  }

  async update(data: UpdateFinancialCategoryDto) {
    return this.databaseService.financialCategory.update({
      where: { id: data.id },
      data,
    });
  }

  async findAll(
    params: PaginationDto<
      Prisma.FinancialCategoryWhereInput,
      Prisma.FinancialCategorySelect,
      Prisma.FinancialCategoryInclude,
      Prisma.FinancialCategoryOrderByWithRelationInput
    >,
  ): Promise<GetFinancialCategoryDto[]> {
    const baseQuery: Prisma.FinancialCategoryFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    return this.databaseService.financialCategory.findMany({
      ...baseQuery,
      orderBy: { createdAt: "desc" },
    });
  }

  async findByName({ name }: Partial<UpdateFinancialCategoryDto>) {
    return this.databaseService.customer.findMany({ where: { name } });
  }
}

export const financialCategoryService = new FinancialCategoryService();
