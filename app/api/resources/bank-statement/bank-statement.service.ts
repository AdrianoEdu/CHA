// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateBankStatementDto,
  GetBankStatementDto,
  GetBankStatementParamsDto,
  UpdateBankStatementDto,
} from "../../dto/BankStatement/BankStatement";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { BankStatemenrtWithRelations, bankStatementSelect } from "./type";
import { GetBankDtoParams } from "../../dto/Bank/bank";

class BankStatementService {
  private databaseService = databaseService;

  async create(data: CreateBankStatementDto) {
    this.databaseService.bankStatement.create({ data });
  }

  async update(data: UpdateBankStatementDto) {
    this.databaseService.bankStatement.update({
      where: { id: data.id },
      data: { ...data },
    });
  }

  async findBankStatement({
    skip,
    where,
    take,
    include,
    orderBy,
  }: PaginationDto<
    Prisma.BankStatementWhereInput,
    Prisma.BankStatementSelect,
    Prisma.BankStatementInclude,
    Prisma.BankStatementOrderByWithRelationInput
  >): Promise<GetBankStatementParamsDto> {
    const baseQuery: Prisma.BankStatementFindManyArgs = {
      skip,
      where,
      take,
      include,
      orderBy,
    };

    const count = await this.databaseService.bankStatement.count({ where });

    if (where)
      return { count, bankStatement: await this.findMany({ ...baseQuery }) };

    return { count, bankStatement: await this.findMany({ ...baseQuery }) };
  }

  async findMany(
    baseQuery: Prisma.BankStatementFindManyArgs,
  ): Promise<GetBankStatementDto[]> {
    const result = await this.databaseService.bankStatement.findMany({
      ...baseQuery,
      include: { currentAccount: true, financialCategory: true },
    });

    return this.mapBankStatement(result);
  }

  mapBankStatement(data: BankStatemenrtWithRelations[]): GetBankStatementDto[] {
    return data.map((bankStatement) => ({
      id: bankStatement.id,
      value: bankStatement.value,
      title: bankStatement.title,
      createdAt: bankStatement.createdAt,
      description: bankStatement.description,
      currentAccount: {
        ...bankStatement.currentAccount,
        balance: Number(bankStatement.currentAccount.balance),
      },
      financalCategory: bankStatement.financialCategory,
    }));
  }
}

export const bankStatementService = new BankStatementService();
