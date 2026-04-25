// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateFinancialCategoryDto,
  GetFinancialCategoryDto,
  RemoveFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "@/app/api/dto/FinancialCategory/FinancialCategory";
import { PaginationDto } from "@/app/api/dto/Pagination/Pagination";
import { HttpException } from "@/app/api/error/HttpException";
import { NotFoundException } from "@/app/api/error/NotFoundException";
import { databaseService } from "@/app/api/providers/database/DatabaseService";
import { Prisma } from "@/app/generated/prisma";

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

  async findFinancialCategory(
    params: PaginationDto<
      Prisma.FinancialCategoryWhereInput,
      Prisma.FinancialCategorySelect,
      Prisma.FinancialCategoryInclude,
      Prisma.FinancialCategoryOrderByWithRelationInput
    >,
  ): Promise<GetFinancialCategoryDto | GetFinancialCategoryDto[]> {
    const baseQuery: Prisma.FinancialCategoryFindManyArgs = {
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

  async findFirst(
    baseQuery: Prisma.FinancialCategoryFindManyArgs,
  ): Promise<GetFinancialCategoryDto> {
    const result = await this.databaseService.financialCategory.findFirst({
      ...baseQuery,
    });

    if (!result) throw new NotFoundException();

    return result;
  }

  async findMany(
    baseQuery: Prisma.FinancialCategoryFindManyArgs,
  ): Promise<GetFinancialCategoryDto[]> {
    return this.databaseService.financialCategory.findMany({
      ...baseQuery,
    });
  }

  async findByName({ name }: Partial<UpdateFinancialCategoryDto>) {
    return this.databaseService.customer.findMany({ where: { name } });
  }

  async delete({ id }: RemoveFinancialCategoryDto) {
    const [countReceived, countPayable] = await Promise.all([
      this.databaseService.transaction.count({
        where: { categoryId: id },
      }),
      this.databaseService.transaction.count({ where: { categoryId: id } }),
    ]);

    if (countPayable > 0 || countReceived > 0)
      throw new HttpException(
        "Já existem registros de categoria financeira associados.",
        400,
      );

    const removedFinancialCategory =
      await this.databaseService.financialCategory.findFirst({ where: { id } });

    if (!removedFinancialCategory)
      throw new HttpException("Categoria financieira não encotrada", 404);

    await this.databaseService.financialCategory.delete({
      where: { id: removedFinancialCategory.id },
    });
  }
}

export const financialCategoryService = new FinancialCategoryService();
