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

  async findAll(
    params: PaginationDto<
      Prisma.CheckUsageWhereInput,
      Prisma.CheckUsageSelect,
      Prisma.CheckUsageInclude,
      Prisma.CheckUsageOrderByWithRelationInput
    >,
  ): Promise<CheckUsageDTO[]> {
    const baseQuery: Prisma.CheckUsageFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    const result = await this.databaseService.checkUsage.findMany({
      ...baseQuery,
      select: {
        id: true,
        notes: true,
        usedAt: true,
        amount: true,
        createdAt: true,
        usageType: true,
        receivedCheck: {
          include: { bank: true, customer: true },
        },
      },
    });

    return result.map((item) => ({
      id: item.id,
      usedAt: item.usedAt,
      createdAt: item.createdAt,
      usageType: item.usageType,
      notes: item.notes ?? undefined,
      amount: item.amount.toNumber(),
      receiveCheck: {
        id: item.receivedCheck.id,
        createdAt: item.receivedCheck.createdAt,
        receivedAt: item.receivedCheck.receivedAt.toISOString(),
        customerId: item.receivedCheck.customer.id,
        customerName: item.receivedCheck.customer.name,
        bankId: item.receivedCheck.bank.id,
        bankName: item.receivedCheck.bank.name,
        agency: item.receivedCheck.agency,
        checkNumber: item.receivedCheck.checkNumber,
        totalAmount: Number(item.receivedCheck.totalAmount),
        currentAmount: Number(item.receivedCheck.currentAmount),
        goodForAt: item.receivedCheck.goodForAt
          ? item.receivedCheck.goodForAt.toISOString()
          : null,
        status: item.receivedCheck.status,
      },
    }));
  }
}

export const checkUsageService = new CheckUsageService();
