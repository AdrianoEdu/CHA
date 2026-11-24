// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AccountType, FinancialFlowType, Prisma, ReceivedCheckStatus } from "@/app/generated/prisma";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import {
  CreateReceivedCheckDTO,
  ReceivedCheckDTO,
  ReceivedCheckParams,
  RemoveReceivedCheckDto,
  UpdateReceivedCheckDTO,
} from "../../dto/ReceivedCheck/ReceivedCheck";
import { ReceivedCheckWithRelations } from "./types";

class ReceivedCheckService {
  private databaseService = databaseService;

  async create(data: CreateReceivedCheckDTO): Promise<void> {
    await this.databaseService.$transaction(async (transaction) => {
      const receivedCheck = await transaction.receivedCheck.create({
        data: {
          notes: data.notes,
          agency: data.agency,
          bankId: data.bankId,
          amount: data.amount,
          goodForAt: data.goodForAt,
          customerId: data.customerId,
          checkNumber: data.checkNumber,
        },
      });

      const account = await transaction.account.findFirst({
        where: {
          accountType: AccountType.CASHBOOK,
        },
      });

      if (!account) {
        throw new HttpException("Conta do caixa não encontrada.", 404);
      }

      const financialCategory =
        await transaction.financialCategory.findFirst({
          where: {
            name: "Pagamento com cheque de terceiro",
            accountType: AccountType.CASHBOOK,
            financialFlowType: FinancialFlowType.OUT,
          },
        });

      if (!financialCategory) {
        throw new HttpException("Categoria financeira não encontrada.", 404);
      }

      await transaction.cashBook.create({
        data: {
          accountId: account.id,
          value: receivedCheck.amount,
          customerId: receivedCheck.customerId,
          financialCategoryId: financialCategory.id,
          title: `Cheque recebido nº ${receivedCheck.checkNumber}`,
          description: `Cheque recebido da agência ${receivedCheck.agency}`,
        },
      });
    });
  }

  async update(data: UpdateReceivedCheckDTO): Promise<void> {
    const result = await this.databaseService.receivedCheck.findFirst({
      where: { id: data.id },
    });

    if (!result) {
      throw new HttpException("Cheque não encontrado.", 404);
    }

    if (result.status === ReceivedCheckStatus.FINALIZED) {
      throw new HttpException(
        "Não é possível atualizar um cheque que já foi finalizado",
        409,
      );
    }

    const status = data.status
      ? this.parseStatus(data.status)
      : result.status;

    await this.databaseService.receivedCheck.update({
      where: { id: data.id },
      data: {
        ...data,
        status,
      },
    });
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

    await this.databaseService.receivedCheck.update({
      where: { id: check.id },
      data: { status: ReceivedCheckStatus.CANCELLED },
    });
  }

  async findByFilters({ checkNumber }: Partial<ReceivedCheckDTO>) {
    return this.databaseService.receivedCheck.findMany({
      where: { checkNumber },
    });
  }

  async findByReceivedChecks(
    params: ReceivedCheckParams,
  ): Promise<{
    count: number;
    receivedChecks: ReceivedCheckWithRelations[];
  }> {
    const baseQuery = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
      include: {
        bank: true,
        customer: true,
      },
    } satisfies Prisma.ReceivedCheckFindManyArgs;

    const count = await this.databaseService.receivedCheck.count({
      where: baseQuery.where,
    });

    const receivedChecks =
      await this.databaseService.receivedCheck.findMany(baseQuery);

    return { count, receivedChecks };
  }

  private parseStatus(status: string): ReceivedCheckStatus {
    const statusUpper = status.toUpperCase();

    const value = ReceivedCheckStatus[statusUpper as ReceivedCheckStatus];

    if (value) return value;

    throw new Error(`Status inválido: ${status}`);
  }
}

export const receivedCheckService = new ReceivedCheckService();
