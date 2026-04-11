// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.
// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { BankDto, RemoveBankDto, UpdateBankDto } from "../../dto/Bank/bank";
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
        receivedAt: new Date(),
        customerId: data.customerId,
        bankId: data.bankId,
        agency: data.agency,
        totalAmount: data.totalAmount,
        currentAmount: data.totalAmount,
        checkNumber: data.checkNumber,
        goodForAt: data.goodForAt,
      },
    });
  }

  async update(data: UpdateReceivedCheckDTO): Promise<void> {
    await this.databaseService.bank.update({
      where: { id: data.id },
      data,
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
        receivedAt: true,
        checkNumber: true,
        totalAmount: true,
        currentAmount: true,
        customer: { select: { id: true, name: true } },
        bank: { select: { id: true, name: true } },
      },
    });

    const checks: ReceivedCheckDTO[] = result.map((check) => ({
      id: check.id,
      createdAt: check.createdAt,
      receivedAt: check.receivedAt.toISOString(),
      customerId: check.customer.id,
      customerName: check.customer.name,
      bankId: check.bank.id,
      bankName: check.bank.name,
      agency: check.agency,
      checkNumber: check.checkNumber,
      totalAmount: Number(check.totalAmount),
      currentAmount: Number(check.currentAmount),
      goodForAt: check.goodForAt ? check.goodForAt.toISOString() : null,
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
}

export const receivedCheckService = new ReceivedCheckService();
