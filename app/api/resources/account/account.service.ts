// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType, Prisma } from "@/app/generated/prisma";
import {
  CreateAccountDto,
  GetAccountDto,
  GetAccountParamsDto,
  UpdateAccountDto,
} from "../../dto/Account/Account";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { AccountWithRelations } from "./type";
import { NotFoundException } from "../../error/NotFoundException";
import { BadRequestException } from "../../error/BadRequestException";

class AccountService {
  private databaseService = databaseService;

  async create(data: CreateAccountDto) {
    return this.databaseService.account.create({ data });
  }

  async update(data: UpdateAccountDto): Promise<void> {
    await this.databaseService.account.update({
      data: { ...data },
      where: { id: data.id },
    });
  }

  async delete(id: string): Promise<void> {
    const account = await databaseService.account.findUnique({
      where: { id },
      include: {
        bankStatement: true,
        cashBook: true,
      },
    });

    if (!account) {
      throw new NotFoundException("Conta não encontrada.");
    }

    if (account.bankStatement.length > 0 || account.cashBook.length > 0) {
      throw new BadRequestException(
        "Não é possível excluir esta conta, pois existem movimentações vinculadas a ela."
      );
    }

    await databaseService.account.delete({
      where: { id },
    });
  }

  async findAccount({
    skip,
    where,
    take,
    select,
    include,
    orderBy,
  }: PaginationDto<
    Prisma.AccountWhereInput,
    Prisma.AccountSelect,
    Prisma.AccountInclude,
    Prisma.AccountOrderByWithRelationInput
  >): Promise<GetAccountParamsDto> {
    const baseQuery: Prisma.AccountFindManyArgs = {
      skip,
      where,
      select,
      include,
      take,
      orderBy,
    };

    const count = await this.databaseService.account.count({ where });

    if (where) return { count, account: await this.findMany(baseQuery) };

    return { count, account: await this.findMany(baseQuery) };
  }

  async findMany(baseQuery: Prisma.AccountFindManyArgs) {
    return this.mapAccount(
      // @ts-ignore
      await this.databaseService.account.findMany({
        ...baseQuery,
      }),
    );
  }

  private mapAccount(data: AccountWithRelations[]): GetAccountDto[] {
    return data.map((account) => ({
      id: account.id,
      bank: account.bank,
      createdAt: account.createdAt,
      balance: Number(account.balance),
      accountType: account.accountType,
      accountNumber: account.accountNumber,
    }));
  }
}

export const accountService = new AccountService();
