// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateCurrentAccountDto,
  GetCurrentAccountDto,
  GetCurrentAccountParamsDto,
  UpdateCurrentAccountDto,
} from "../../dto/CurrentAccount/CurrentAccount";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { CurrentAccountWithRelations } from "./type";

class CurrentAccountService {
  private databaseService = databaseService;

  async create(data: CreateCurrentAccountDto) {
    return this.databaseService.currentAccount.create({ data });
  }

  async update(data: UpdateCurrentAccountDto): Promise<void> {
    this.databaseService.currentAccount.update({
      data: { ...data },
      where: { id: data.id },
    });
  }

  async findCurrentAccount({
    skip,
    where,
    take,
    select,
    include,
    orderBy,
  }: PaginationDto<
    Prisma.CurrentAccountWhereInput,
    Prisma.CurrentAccountSelect,
    Prisma.CurrentAccountInclude,
    Prisma.CurrentAccountOrderByWithRelationInput
  >): Promise<GetCurrentAccountParamsDto> {
    const baseQuery: Prisma.CurrentAccountFindManyArgs = {
      skip,
      where,
      select,
      include,
      take,
      orderBy,
    };

    const count = await this.databaseService.currentAccount.count({ where });

    if (where) return { count, currentAccount: await this.findMany(baseQuery) };

    return { count, currentAccount: await this.findMany(baseQuery) };
  }

  async findMany(baseQuery: Prisma.CurrentAccountFindManyArgs) {
    return this.mapCurrentAccount(
      // @ts-ignore
      await this.databaseService.currentAccount.findMany({
        ...baseQuery,
      }),
    );
  }

  mapCurrentAccount(
    data: CurrentAccountWithRelations[],
  ): GetCurrentAccountDto[] {
    return data.map((currentAccount) => ({
      id: currentAccount.id,
      bank: currentAccount.bank,
      createdAt: currentAccount.createdAt,
      balance: Number(currentAccount.balance),
      accountNumber: currentAccount.accountNumber,
    }));
  }
}

export const currentAccountService = new CurrentAccountService();
