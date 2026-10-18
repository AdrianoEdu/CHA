// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreatePaymentDto,
  RemoverPaymentDto,
  UpdatePaymentDto,
} from "../../dto/Payment/Payment";
import { parsePrismaQuery } from "../../utils/parseFindParams";
import { paymentService } from "./payment.service";

class PaymentController {
  private paymentService;

  constructor() {
    this.paymentService = paymentService;
  }

  async create(data: CreatePaymentDto) {
    await this.paymentService.create(data);
  }

  async update(data: UpdatePaymentDto) {
    return this.paymentService.update(data);
  }

  async findAll(req: Request) {
    try {
      const query = parsePrismaQuery<
        Prisma.PaymentWhereInput,
        Prisma.PaymentSelect,
        Prisma.PaymentInclude,
        Prisma.PaymentOrderByWithRelationInput
      >(req);

      return this.paymentService.findRecurringPayment(query);
    } catch (error: any) {
      console.error("Erro ao buscar Customer:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async remove({ id }: RemoverPaymentDto) {
    return await this.paymentService.remove({ id });
  }
}

export const paymentController = new PaymentController();
