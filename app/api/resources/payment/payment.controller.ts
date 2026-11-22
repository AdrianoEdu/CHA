// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreatePaymentDto,
  RemoverPaymentDto,
  UpdatePaymentDto,
} from "../../dto/Payment/Payment";
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

  async remove({ id }: RemoverPaymentDto) {
    return await this.paymentService.remove({ id });
  }
}

export const paymentController = new PaymentController();
