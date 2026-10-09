// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma, ReceivedCheckStatus } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import {
  CreateReceivedCheckDTO,
  GetReceivedCheckDTOParams,
  ReceivedCheckDTO,
  RemoveReceivedCheckDto,
  UpdateReceivedCheckDTO,
} from "../../dto/ReceivedCheck/ReceivedCheck";
import { receivedCheckSelect, ReceivedCheckWithRelations } from "./types";

class ReceivedCheckService {
  private databaseService = databaseService;

  async create(data: CreateReceivedCheckDTO): Promise<void> {
    await databaseService.receivedCheck.create({
      data: {
        agency: data.agency,
        bankId: data.bankId,
        amount: data.amount,
        goodForAt: data.goodForAt,
        customerId: data.customerId,
        checkNumber: data.checkNumber,
      },
    });
  }

  async update(data: UpdateReceivedCheckDTO): Promise<void> {
    const result = await this.databaseService.receivedCheck.findFirst({
      where: { id: data.id },
    });

    if (result?.status === ReceivedCheckStatus.FINALIZED) {
      new HttpException(
        "Não é possível atualizar um cheque que ja foi finalizado",
        409,
      );
    }

    await this.databaseService.receivedCheck.update({
      where: { id: data.id },
      data: { ...data },
    });
  }

  async findReceivedCheck(
    params: PaginationDto<
      Prisma.ReceivedCheckWhereInput,
      Prisma.ReceivedCheckSelect,
      Prisma.ReceivedCheckInclude,
      Prisma.ReceivedCheckOrderByWithRelationInput
    >,
  ): Promise<GetReceivedCheckDTOParams> {
    const baseQuery: Prisma.ReceivedCheckFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    const count = await this.databaseService.receivedCheck.count({
      where: baseQuery.where,
    });

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    if (params.where)
      return { count, receivedChecks: await this.findManyByFilters(baseQuery) };

    return { count, receivedChecks: await this.findMany(baseQuery) };
  }

  async findManyByFilters(
    baseQuery: Prisma.ReceivedCheckFindManyArgs,
  ): Promise<ReceivedCheckDTO[]> {
    const result = await this.databaseService.receivedCheck.findMany({
      ...baseQuery,
      select: receivedCheckSelect,
      orderBy: { createdAt: "desc" },
    });

    return result.map((receivedCheck) => this.mapperCheckUsage(receivedCheck));
  }

  async findMany(
    baseQuery: Prisma.ReceivedCheckFindManyArgs,
  ): Promise<ReceivedCheckDTO[]> {
    const result: ReceivedCheckWithRelations[] =
      await this.databaseService.receivedCheck.findMany({
        ...baseQuery,
        where: undefined,
        select: receivedCheckSelect,
        orderBy: { createdAt: "desc" },
      });

    return result.map((receivedCheck) => this.mapperCheckUsage(receivedCheck));
  }

  async remove({ id }: RemoveReceivedCheckDto) {
    const check = await this.databaseService.receivedCheck.findUnique({
      where: { id },
    });

    if (!check) {
      throw new HttpException("Cheque não encontrado.", 404);
    }

    if (check.status === ReceivedCheckStatus.FINALIZED) {
      throw new HttpException(
        "Não é possível remover um cheque utilizado.",
        409,
      );
    }

    await this.databaseService.receivedCheck.delete({
      where: { id: check.id },
    });
  }

  async findByFilters({ checkNumber }: Partial<ReceivedCheckDTO>) {
    return this.databaseService.receivedCheck.findMany({
      where: { checkNumber },
    });
  }

  private parseStatus(status: string): ReceivedCheckStatus {
    const statusUpper = status.toUpperCase();

    const value = ReceivedCheckStatus[statusUpper as ReceivedCheckStatus];

    if (value) return value;

    throw new Error(`Status inválido: ${status}`);
  }

  private mapperCheckUsage(item: ReceivedCheckWithRelations): ReceivedCheckDTO {
    return {
      bank: {
        id: item.bank?.id,
        name: item.bank?.name ?? "",
        createdAt: item.bank?.createdAt,
        agencies: item.bank.agencies,
      },
      customer: {
        id: item.customer?.id ?? "",
        name: item.customer?.name ?? "",
        code: item.customer?.code ?? "",
        isActive: item.customer?.isActive,
        numberId: item.customer?.numberId,
        createdAt: item.customer?.createdAt ?? new Date(),
      },
      id: item.id,
      agency: item.agency,
      notes: item.notes,
      paidAt: item.paidAt,
      status: item.status,
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
      goodForAt: item.goodForAt,
      amount: Number(item.amount),
      checkNumber: item.checkNumber,
    };
  }
}

export const receivedCheckService = new ReceivedCheckService();
