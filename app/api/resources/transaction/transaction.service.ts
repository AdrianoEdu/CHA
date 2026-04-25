// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import {
  CreateTransactionDTO,
  GetTrasnactionDTO,
  UpdateTransactionDTO,
} from "../../dto/Transaction/Tansaction";
import { databaseService } from "../../providers/database/DatabaseService";
import { transactionSelect, TransactionWithRelations } from "./type";
import { NotFoundException } from "../../error/NotFoundException";

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

  async findTransaction(
    params: PaginationDto<
      Prisma.TransactionWhereInput,
      Prisma.TransactionSelect,
      Prisma.TransactionInclude,
      Prisma.TransactionOrderByWithRelationInput
    >,
  ): Promise<GetTrasnactionDTO | GetTrasnactionDTO[]> {
    const baseQuery: Prisma.TransactionFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    if (!params.all) return await this.findFirst(baseQuery);

    return await this.findAll(baseQuery);
  }

  async findAll(
    baseQuery: Prisma.TransactionFindManyArgs,
  ): Promise<GetTrasnactionDTO[]> {
    const result = await this.databaseService.transaction.findMany({
      ...baseQuery,
      select: transactionSelect,
    });

    return result.map((transaction) => this.mapperTransation(transaction));
  }

  async findFirst(
    baseQuery: Prisma.TransactionFindManyArgs,
  ): Promise<GetTrasnactionDTO> {
    const result = await this.databaseService.transaction.findFirst({
      ...baseQuery,
      select: transactionSelect,
    });

    if (!result) throw new NotFoundException();

    return this.mapperTransation(result);
  }

  mapperTransation(item: TransactionWithRelations): GetTrasnactionDTO {
    return {
      id: item.id,
      type: item.type,
      dueDate: item.dueDate,
      category: item.category,
      customer: item.customer,
      createdAt: item.createdAt,
      amount: item.amount.toNumber(),
      settledAt: item.settledAt ?? undefined,
    };
  }
}

export const transactionService = new TransactionService();
