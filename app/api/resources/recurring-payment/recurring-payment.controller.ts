// Copyright (c) 2026-03-21
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.

import { Prisma } from "@/app/generated/prisma";
import { parsePrismaQuery } from "@/app/api/utils/parseFindParams";
import { recurringPaymentService } from "./recurring-payment.service";
import {
  CreateRecurringPaymentDto,
  RemoverRecurringPaymentDto,
  UpdateRecurringPaymentDto,
} from "../../dto/RecurringPayment/recurringPayment";

class RecurringPaymentController {
  private recurringPaymentService;

  constructor() {
    this.recurringPaymentService = recurringPaymentService;
  }

  async create(data: CreateRecurringPaymentDto) {
    return this.recurringPaymentService.create(data);
  }

  async update(data: UpdateRecurringPaymentDto) {
    return this.recurringPaymentService.update(data);
  }

  async findAll(req: Request) {
    try {
      const query = parsePrismaQuery<
        Prisma.RecurringPaymentWhereInput,
        Prisma.RecurringPaymentSelect,
        Prisma.RecurringPaymentInclude,
        Prisma.RecurringPaymentOrderByWithRelationInput
      >(req);

      return this.recurringPaymentService.findRecurringPayment(query);
    } catch (error: any) {
      console.error("Erro ao buscar Customer:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async remove({ id }: RemoverRecurringPaymentDto) {
    return await this.recurringPaymentService.remove({ id });
  }
}

export const recurringPaymentController = new RecurringPaymentController();
