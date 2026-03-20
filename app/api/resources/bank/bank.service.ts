// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { BankDto, UpdateBankDto } from "../../dto/Bank/bank";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";

class BankService {
  private databaseService = databaseService;

  async create({ agencies, name }: BankDto): Promise<BankDto> {
    return this.databaseService.bank.create({ data: { name, agencies } });
  }

  async update(data: UpdateBankDto): Promise<void> {
    await this.databaseService.bank.update({
      where: { id: data.id },
      data,
    });
  }

  async findAll(
    params: PaginationDto<
      Prisma.BankWhereInput,
      Prisma.BankSelect,
      Prisma.BankInclude,
      Prisma.BankOrderByWithRelationInput
    >,
  ): Promise<BankDto[]> {
    const baseQuery: Prisma.BankFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    return await this.databaseService.bank.findMany({
      ...baseQuery,
      orderBy: { createdAt: "desc" },
    });
  }
}

export const bankService = new BankService();
