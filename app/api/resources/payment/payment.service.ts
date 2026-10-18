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
import { PaymentWithRelations } from "./type";

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

  async findRecurringPayment(
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

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    const count = await this.databaseService.payment.count({
      where: baseQuery.where,
    });

    if (params.where)
      return {
        count,
        payment: await this.findManyByFilters(baseQuery),
      };

    return { count, payment: await this.findMany(baseQuery) };
  }

  async findMany(
    baseQuery: Prisma.PaymentFindManyArgs,
  ): Promise<GetPaymentDto[]> {
    const result = await this.databaseService.payment.findMany({
      ...baseQuery,
      include: {
        ...baseQuery.include,
        financialCategory: true,
        recurringPayment: {
          include: {
            financialCategory: true,
          },
        },
        employee: {
          include: {
            employeePosition: true,
          },
        },
        customer: true,
      },
    });

    return this.mapperPayment(result);
  }

  async findManyByFilters(
    baseQuery: Prisma.PaymentFindManyArgs,
  ): Promise<GetPaymentDto[]> {
    const result = await this.databaseService.payment.findMany({
      ...baseQuery,
      include: {
        ...baseQuery.include,
        financialCategory: true,
        recurringPayment: {
          include: {
            financialCategory: true,
          },
        },
        customer: true,
        employee: {
          include: {
            employeePosition: true,
          },
        },
      },
    });

    return this.mapperPayment(result);
  }

  private mapperPayment(data: PaymentWithRelations[]): GetPaymentDto[] {
    return data.map((item) => ({
      ...item,
      paidAt: item.paidAt,
      amount: Number(item.amount),
      employee: {
        updatedAt: item.updatedAt,
        id: item.employee?.id ?? "",
        name: item.employee?.name ?? "",
        document: item.employee?.document ?? "",
        isActive: item.employee?.isActive ?? true,
        createdAt: item.employee?.createdAt ?? new Date(),
        dateOfBirth: item.employee?.dateOfBirth ?? new Date(),
        employeePosition: {
          id: item.employee?.employeePosition.id ?? "",
          position:
            item.employee?.employeePosition.position ??
            "ADMINISTRATIVE_ASSISTANT",
        },
      },
      customer: {
        id: item?.customer?.id ?? "",
        code: item.customer?.code ?? "",
        name: item.customer?.name ?? "",
        numberId: item.customer?.numberId ?? 0,
        createdAt: item.createdAt ?? new Date(),
        isActive: item.customer?.isActive ?? true,
      },
      recurringPayment: {
        id: item.recurringPayment?.id ?? "",
        name: item.recurringPayment?.name ?? "",
        dueDay: item.recurringPayment?.dueDay ?? 0,
        isMonthly: item.recurringPayment?.isMonthly ?? false,
        isFixedAmount: item.recurringPayment?.isFixedAmount ?? false,
        fixedAmount: Number(item.recurringPayment?.fixedAmount ?? 0),
        createdAt: item.recurringPayment?.createdAt ?? new Date(),
        updatedAt: item.recurringPayment?.updatedAt ?? new Date(),
        financialCategory: {
          id: item.recurringPayment?.financialCategory?.id ?? "",
          name: item.recurringPayment?.financialCategory?.name ?? "",
          createdAt:
            item.recurringPayment?.financialCategory?.createdAt ?? new Date(),
          updatedAt:
            item.recurringPayment?.financialCategory?.updatedAt ?? new Date(),
          financialFlowType:
            item.recurringPayment?.financialCategory?.financialFlowType ??
            "OUT",
        },
      },
      financialCategory: {
        id: item.financialCategory.id ?? "",
        name: item.financialCategory.name ?? "",
        createdAt: item.financialCategory.createdAt ?? new Date(),
        updatedAt: item.financialCategory.updatedAt ?? new Date(),
        financialFlowType: item.financialCategory.financialFlowType ?? "OUT",
      },
    }));
  }
}

export const paymentService = new PaymentService();
