// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateRecurringPaymentDto,
  GetRecurringPaymentDtoParams,
  RecurringPaymentParams,
  UpdateRecurringPaymentDto,
} from "../../dto/recurring-payment";
import { requestService } from "../requestService/requestService";

class RecurringPaymentService {
  private readonly url: string;

  constructor() {
    this.url = "/recurring-payment";
  }

  create(data: CreateRecurringPaymentDto) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateRecurringPaymentDto) {
    return requestService.update(this.url, data);
  }

  findAll(data: RecurringPaymentParams) {
    return requestService.getAll<
      RecurringPaymentParams,
      GetRecurringPaymentDtoParams
    >(this.url, data);
  }

  remove(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const recurringPaymentService = new RecurringPaymentService();
