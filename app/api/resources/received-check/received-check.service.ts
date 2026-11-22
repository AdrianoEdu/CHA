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

  private parseStatus(status: string): ReceivedCheckStatus {
    const statusUpper = status.toUpperCase();

    const value = ReceivedCheckStatus[statusUpper as ReceivedCheckStatus];

    if (value) return value;

    throw new Error(`Status inválido: ${status}`);
  }


}

export const receivedCheckService = new ReceivedCheckService();
