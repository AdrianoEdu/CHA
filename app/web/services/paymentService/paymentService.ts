// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreatePaymentDto,
  GetPaymentDtoParams,
  PaymentParams,
  UpdatePaymentDto,
} from "../../dto/payment";
import { requestService } from "../requestService/requestService";

class PaymentService {
  private readonly url: string;

  constructor() {
    this.url = "/payment";
  }

  create(data: CreatePaymentDto) {
    return requestService.post(this.url, data);
  }

  update(data: UpdatePaymentDto) {
    return requestService.update(this.url, data);
  }

  findAll(data: PaymentParams) {
    return requestService.getAll<PaymentParams, GetPaymentDtoParams>(
      this.url,
      data,
    );
  }

  remove(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const paymentService = new PaymentService();
