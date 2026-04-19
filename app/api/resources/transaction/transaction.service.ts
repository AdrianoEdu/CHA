// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import {
  CreateTransactionDTO,
  TrasnactionDTO,
  UpdateTransactionDTO,
} from "../../dto/Transaction/Tansaction";
import { databaseService } from "../../providers/database/DatabaseService";

class TransactionService {
  private databaseService = databaseService;

  create(data: CreateTransactionDTO) {
    return this.databaseService.transaction.create({ data });
  }

  update({ id, ...data }: UpdateTransactionDTO) {
    return this.databaseService.transaction.update({
      where: { id },
      data: { ...data },
    });
  }

  async findAll(
    params: PaginationDto<
      Prisma.TransactionWhereInput,
      Prisma.TransactionSelect,
      Prisma.TransactionInclude,
      Prisma.TransactionOrderByWithRelationInput
    >,
  ): Promise<TrasnactionDTO[]> {
    const baseQuery: Prisma.TransactionFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    const result = await this.databaseService.transaction.findMany({
      ...baseQuery,
      select: {
        id: true,
        type: true,
        amount: true,
        dueDate: true,
        customer: true,
        category: true,
        settledAt: true,
        createdAt: true,
      },
    });

    return result.map((item) => ({
      id: item.id,
      type: item.type,
      dueDate: item.dueDate,
      category: item.category,
      customer: item.customer,
      createdAt: item.createdAt,
      amount: item.amount.toNumber(),
      settledAt: item.settledAt ?? undefined,
    }));
  }
}

export const transactionService = new TransactionService();
