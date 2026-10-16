// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma, RecurringPayment } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import { CreateBankDto } from "@/app/web/dto/bank.dto";
import {
  CreateRecurringPaymentDto,
  GetRecurringPaymentDto,
  GetRecurringPaymentDtoParams,
  RemoverRecurringPaymentDto,
  UpdateRecurringPaymentDto,
} from "../../dto/RecurringPayment/recurringPayment";

class RecurringPaymentService {
  private databaseService = databaseService;

  async create(data: CreateRecurringPaymentDto): Promise<void> {
    await this.databaseService.recurringPayment.create({
      data,
    });
  }

  async update(data: UpdateRecurringPaymentDto): Promise<void> {
    await this.databaseService.bank.update({
      where: { id: data.id },
      data,
    });
  }

  async findRecurringPayment(
    params: PaginationDto<
      Prisma.RecurringPaymentWhereInput,
      Prisma.RecurringPaymentSelect,
      Prisma.RecurringPaymentInclude,
      Prisma.RecurringPaymentOrderByWithRelationInput
    >,
  ): Promise<GetRecurringPaymentDtoParams> {
    const baseQuery: Prisma.RecurringPaymentFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    const count = await this.databaseService.recurringPayment.count({
      where: baseQuery.where,
    });

    if (params.where)
      return {
        count,
        recurringPayment: await this.findManyByFilters(baseQuery),
      };

    return { count, recurringPayment: await this.findMany(baseQuery) };
  }

  async findMany(
    baseQuery: Prisma.RecurringPaymentFindManyArgs,
  ): Promise<GetRecurringPaymentDto[]> {
    const result = await this.databaseService.recurringPayment.findMany({
      ...baseQuery,
    });

    return this.mapperRecurringPayment(result);
  }

  async findManyByFilters(
    baseQuery: Prisma.RecurringPaymentFindManyArgs,
  ): Promise<GetRecurringPaymentDto[]> {
    const result = await this.databaseService.recurringPayment.findMany({
      ...baseQuery,
    });

    return this.mapperRecurringPayment(result);
  }

  async remove({ id }: RemoverRecurringPaymentDto) {
    const count = await this.databaseService.payment.count({
      where: {
        recurringPaymentId: id,
      },
    });

    if (count > 0) {
      throw new HttpException(
        "Não é possível excluir este pagamento recorrente, pois existem pagamentos associados a ele.",
        400,
      );
    }

    const recurringPayment =
      await this.databaseService.recurringPayment.findUnique({
        where: { id },
      });

    if (!recurringPayment) {
      throw new HttpException("Pagamento recorrente não encontrado.", 404);
    }

    await this.databaseService.recurringPayment.delete({
      where: { id },
    });
  }

  private mapperRecurringPayment(
    data: RecurringPayment[],
  ): GetRecurringPaymentDto[] {
    return data.map((item) => ({
      ...item,
      fixedAmount: Number(item.fixedAmount),
    }));
  }
}

export const recurringPaymentService = new RecurringPaymentService();
