// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.
// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  Bank,
  Customer,
  Prisma,
  ReceivedCheck,
  ReceivedCheckStatus,
} from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import {
  CreateReceivedCheckDTO,
  ReceivedCheckDTO,
  RemoveReceivedCheckDto,
  UpdateReceivedCheckDTO,
} from "../../dto/ReceivedCheck/ReceivedCheck";
import { receivedCheckSelect, ReceivedCheckWithRelations } from "./types";
import { NotFoundException } from "../../error/NotFoundException";

class ReceivedCheckService {
  private databaseService = databaseService;

  async create(data: CreateReceivedCheckDTO): Promise<void> {
    await databaseService.receivedCheck.create({
      data: {
        bankId: data.bankId,
        agency: data.agency,
        goodForAt: data.goodForAt,
        customerId: data.customerId,
        checkNumber: data.checkNumber,
        totalAmount: new Prisma.Decimal(data.totalAmount ?? 0),
        currentAmount: new Prisma.Decimal(data.currentAmount ?? 0),
      },
    });
  }

  async update(data: UpdateReceivedCheckDTO): Promise<void> {
    const { bankId, customerId, status, ...receivedUpdated } = data;
    await this.databaseService.receivedCheck.update({
      where: { id: data.id },
      data: {
        ...receivedUpdated,
        status: this.parseStatus(data.status!),
        bank: { connect: { id: data.bankId } },
        customer: { connect: { id: data.customerId } },
      },
    });
  }

  async findReceivedCheck(
    params: PaginationDto<
      Prisma.ReceivedCheckWhereInput,
      Prisma.ReceivedCheckSelect,
      Prisma.ReceivedCheckInclude,
      Prisma.ReceivedCheckOrderByWithRelationInput
    >,
  ): Promise<ReceivedCheckDTO | ReceivedCheckDTO[]> {
    const baseQuery: Prisma.ReceivedCheckFindManyArgs = {
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

  async findFirst(
    baseQuery: Prisma.ReceivedCheckFindManyArgs,
  ): Promise<ReceivedCheckDTO> {
    const result: ReceivedCheckWithRelations | null =
      await this.databaseService.receivedCheck.findFirst({
        ...baseQuery,
        select: receivedCheckSelect,
        orderBy: { createdAt: "desc" },
      });

    if (!result) throw new NotFoundException();

    return this.mapperCheckUsage(result);
  }

  async findMany(
    baseQuery: Prisma.ReceivedCheckFindManyArgs,
  ): Promise<ReceivedCheckDTO[]> {
    const result: ReceivedCheckWithRelations[] =
      await this.databaseService.receivedCheck.findMany({
        ...baseQuery,
        select: receivedCheckSelect,
        orderBy: { createdAt: "desc" },
      });

    return result.map((receivedCheck) => this.mapperCheckUsage(receivedCheck));
  }

  async remove({ id }: RemoveReceivedCheckDto) {
    const check = await this.databaseService.receivedCheck.findUnique({
      where: { id },
      include: {
        usages: true,
      },
    });

    if (!check) {
      throw new HttpException("Cheque não encontrado.", 404);
    }

    if (check.usages.length > 0) {
      throw new HttpException(
        "Este cheque possui registros de uso e não pode ser removido.",
        400,
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
      id: item.id,
      bank: {
        id: item.bank?.id,
        name: item.bank?.name ?? "",
        createdAt: item.bank?.createdAt,
        agencies: item.bank?.agencies ?? [],
      },
      agency: item.agency,
      customer: {
        id: item.customer?.id ?? "",
        name: item.customer?.name ?? "",
        code: item.customer?.code ?? "",
        createdAt: item.customer?.createdAt ?? new Date(),
        customerType: item.customer?.customerType ?? "CLIENT",
      },
      createdAt: item.createdAt,
      checkNumber: item.checkNumber,
      totalAmount: Number(item.totalAmount),
      goodForAt: item.goodForAt ?? undefined,
      currentAmount: Number(item.currentAmount),
      status: item.status,
    };
  }
}

export const receivedCheckService = new ReceivedCheckService();
