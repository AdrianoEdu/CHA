// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreatePaymentDto,
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
}

export const paymentService = new PaymentService();
