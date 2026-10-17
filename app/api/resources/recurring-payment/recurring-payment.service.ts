// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import {
  CreateRecurringPaymentDto,
  GetRecurringPaymentDto,
  GetRecurringPaymentDtoParams,
  RemoverRecurringPaymentDto,
  UpdateRecurringPaymentDto,
} from "../../dto/RecurringPayment/recurringPayment";
import { RecurrentPaymentWithRelations } from "./type";

class RecurringPaymentService {
  private databaseService = databaseService;

  async create(data: CreateRecurringPaymentDto): Promise<void> {
    await this.databaseService.recurringPayment.create({
      data,
    });
  }

  async update(data: UpdateRecurringPaymentDto) {
    return await this.databaseService.recurringPayment.update({
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
      include: { ...baseQuery.include, financialCategory: true },
    });

    return this.mapperRecurringPayment(result);
  }

  async findManyByFilters(
    baseQuery: Prisma.RecurringPaymentFindManyArgs,
  ): Promise<GetRecurringPaymentDto[]> {
    const result = await this.databaseService.recurringPayment.findMany({
      ...baseQuery,
      include: { ...baseQuery.include, financialCategory: true },
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
    data: RecurrentPaymentWithRelations[],
  ): GetRecurringPaymentDto[] {
    return data.map((item) => ({
      ...item,
      fixedAmount: Number(item.fixedAmount),
      financialCategory: item.financialCategory,
    }));
  }

  async generateMonthlyPayments(): Promise<{ count: number }> {
    const recurringPayments = await databaseService.recurringPayment.findMany({
      where: {
        isMonthly: true,
      },
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let count = 0;

    for (const recurringPayment of recurringPayments) {
      const createdAt = recurringPayment.createdAt;

      const startYear = createdAt.getFullYear();
      const startMonth = createdAt.getMonth();

      for (
        let year = startYear, month = startMonth;
        year < currentYear || (year === currentYear && month <= currentMonth);
        month++
      ) {
        if (month > 11) {
          month = 0;
          year++;
        }

        const referenceMonth = new Date(Date.UTC(year, month, 1, 12));

        const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

        const dueDay = Math.min(recurringPayment.dueDay, lastDay);

        const dueDate = new Date(Date.UTC(year, month, dueDay, 12));

        const amount = recurringPayment.isFixedAmount
          ? (recurringPayment.fixedAmount ?? new Prisma.Decimal(0))
          : new Prisma.Decimal(0);

        const result = await databaseService.payment.createMany({
          data: [
            {
              name: recurringPayment.name,
              amount,
              dueDate,
              referenceMonth,
              recurringPaymentId: recurringPayment.id,
              customerId: recurringPayment.customerId,
              employeeId: recurringPayment.employeeId,
              financialCategoryId: recurringPayment.financialCategoryId,
            },
          ],
          skipDuplicates: true,
        });

        count += result.count;
      }
    }

    return { count };
  }
}

export const recurringPaymentService = new RecurringPaymentService();
