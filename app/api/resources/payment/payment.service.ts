// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import {
  CreatePaymentDto,
  GetPaymentDto,
  GetPaymentDtoParams,
  RemoverPaymentDto,
  UpdatePaymentDto,
} from "../../dto/Payment/Payment";
import { databaseService } from "../../providers/database/DatabaseService";

class PaymentService {
  private databaseService = databaseService;

  async create(data: CreatePaymentDto): Promise<void> {
    await this.databaseService.payment.create({
      data,
    });
  }

  async update(data: UpdatePaymentDto) {
    return await this.databaseService.payment.update({
      where: { id: data.id },
      data,
    });
  }

  async remove({ id }: RemoverPaymentDto) {
    return await this.databaseService.payment.delete({
      where: { id },
    });
  }

  async findPayment(
    params: PaginationDto<
      Prisma.PaymentWhereInput,
      Prisma.PaymentSelect,
      Prisma.PaymentInclude,
      Prisma.PaymentOrderByWithRelationInput
    >,
  ): Promise<GetPaymentDtoParams> {
    const baseQuery: Prisma.PaymentFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    const count = await this.databaseService.payment.count({
      where: baseQuery.where,
    });

    const payment = await this.databaseService.payment.findMany({
      ...baseQuery,
      include: {
        ...params.include,
        financialCategory: true,
      },
    });

    const result = payment.map((item) => ({
      ...item,
      amount: Number(item.amount),
      employee: item.employee
        ? {
          ...item.employee,
          salary: Number(item.employee.salary),
        }
        : null,
      recurringPayment: item.recurringPayment
        ? {
          ...item.recurringPayment,
          adjustment: item.recurringPayment.adjustment ?? undefined,
        }
        : null,
    }));

    return { count, payment: result };
  }
}

export const paymentService = new PaymentService();
