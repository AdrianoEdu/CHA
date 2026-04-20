// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.
// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma, ReceivedCheckStatus } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import {
  CreateReceivedCheckDTO,
  ReceivedCheckDTO,
  RemoveReceivedCheckDto,
  UpdateReceivedCheckDTO,
} from "../../dto/ReceivedCheck/ReceivedCheck";

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

  async findAll(
    params: PaginationDto<
      Prisma.ReceivedCheckWhereInput,
      Prisma.ReceivedCheckSelect,
      Prisma.ReceivedCheckInclude,
      Prisma.ReceivedCheckOrderByWithRelationInput
    >,
  ): Promise<ReceivedCheckDTO[]> {
    const baseQuery: Prisma.ReceivedCheckFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    const result = await this.databaseService.receivedCheck.findMany({
      ...baseQuery,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        agency: true,
        status: true,
        createdAt: true,
        goodForAt: true,
        checkNumber: true,
        totalAmount: true,
        currentAmount: true,
        customer: {
          select: {
            id: true,
            name: true,
            code: true,
            customerType: true,
            createdAt: true,
          },
        },
        bank: { select: { id: true, name: true, agencies: true } },
      },
    });

    const checks: ReceivedCheckDTO[] = result.map((check) => ({
      id: check.id,
      bank: check.bank,
      agency: check.agency,
      bankId: check.bank.id,
      customer: check.customer,
      bankName: check.bank.name,
      createdAt: check.createdAt,
      customerId: check.customer.id,
      checkNumber: check.checkNumber,
      customerName: check.customer.name,
      totalAmount: Number(check.totalAmount),
      goodForAt: check.goodForAt ?? undefined,
      currentAmount: Number(check.currentAmount),
      status: check.status,
    }));

    return checks;
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
}

export const receivedCheckService = new ReceivedCheckService();
