// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { BankDto, RemoveBankDto, UpdateBankDto } from "../../dto/Bank/bank";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import { NotFoundException } from "../../error/NotFoundException";

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

  async findBank(
    params: PaginationDto<
      Prisma.BankWhereInput,
      Prisma.BankSelect,
      Prisma.BankInclude,
      Prisma.BankOrderByWithRelationInput
    >,
  ): Promise<BankDto | BankDto[]> {
    const baseQuery: Prisma.BankFindManyArgs = {
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

  async findMany(baseQuery: Prisma.BankFindManyArgs): Promise<BankDto[]> {
    return await this.databaseService.bank.findMany({
      ...baseQuery,
    });
  }

  async findFirst(baseQuery: Prisma.BankFindManyArgs): Promise<BankDto> {
    const result = await this.databaseService.bank.findFirst({
      ...baseQuery,
    });

    if (!result) throw new NotFoundException();

    return result;
  }

  async remove({ id }: RemoveBankDto) {
    const count = await this.databaseService.receivedCheck.count({
      where: { bankId: id },
    });

    if (count > 0)
      throw new HttpException(
        "Já existem registros de adiantamento associados a este motivo.",
        400,
      );

    const removedBank = await this.databaseService.bank.findFirst({
      where: { id },
    });

    if (!removedBank) {
      throw new HttpException("Banco não encontrado.", 404);
    }

    await this.databaseService.bank.delete({ where: { id: removedBank?.id } });
  }
}

export const bankService = new BankService();
