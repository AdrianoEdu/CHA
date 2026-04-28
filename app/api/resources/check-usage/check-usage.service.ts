// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CheckUsageDTO,
  CreateCheckUsageDTO,
  UpdateCheckUsageDTO,
} from "../../dto/CheckUsage/CheckUsage";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { checkUsageSelect, CheckUsageWithRelations } from "./type";
import { NotFoundException } from "../../error/NotFoundException";

class CheckUsageService {
  private databaseService = databaseService;

  create(data: CreateCheckUsageDTO) {
    return this.databaseService.checkUsage.create({ data });
  }

  update({ id, ...data }: UpdateCheckUsageDTO) {
    return this.databaseService.checkUsage.update({
      where: { id },
      data: { ...data, notes: data.notes ?? undefined },
    });
  }

  async findMany(baseQuery: Prisma.CheckUsageFindManyArgs) {
    const result = await this.databaseService.checkUsage.findMany({
      ...baseQuery,
      select: checkUsageSelect,
    });

    return result.map((checkUsage) => this.mapperCheckUsage(checkUsage));
  }

  async findFirst(baseQuery: Prisma.CheckUsageFindManyArgs) {
    const result = await this.databaseService.checkUsage.findFirst({
      ...baseQuery,
      select: checkUsageSelect,
    });

    if (!result) throw new NotFoundException();

    return this.mapperCheckUsage(result);
  }

  async findCheckUsage(
    params: PaginationDto<
      Prisma.CheckUsageWhereInput,
      Prisma.CheckUsageSelect,
      Prisma.CheckUsageInclude,
      Prisma.CheckUsageOrderByWithRelationInput
    >,
  ): Promise<CheckUsageDTO | CheckUsageDTO[]> {
    const baseQuery: Prisma.CheckUsageFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    if (!params.all) this.findFirst(baseQuery);

    return this.findMany(baseQuery);
  }

  mapperCheckUsage(item: CheckUsageWithRelations): CheckUsageDTO {
    return {
      id: item.id,
      usedAt: item.usedAt,
      createdAt: item.createdAt,
      usageType: item.usageType,
      transaction: {
        id: item.transaction.id,
        amount: item.transaction.amount.toNumber(),
      },
      notes: item.notes ?? undefined,
      amount: item.amount.toNumber(),
      receivedCheck: {
        id: item.receivedCheck.id,
        bank: item.receivedCheck.bank,
        status: item.receivedCheck.status,
        agency: item.receivedCheck.agency,
        customer: item.receivedCheck.customer,
        createdAt: item.receivedCheck.createdAt,
        checkNumber: item.receivedCheck.checkNumber,
        goodForAt: item.receivedCheck.goodForAt ?? undefined,
        totalAmount: item.receivedCheck.totalAmount.toNumber(),
        currentAmount: item.receivedCheck.currentAmount.toNumber(),
      },
    };
  }
}

export const checkUsageService = new CheckUsageService();
