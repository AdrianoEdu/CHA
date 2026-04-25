// Copyright (c) 2026-04-25
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateTransactionDTO,
  GetTrasnactionDTO,
  TransactionParams,
  UpdateTransactionDTO,
} from "../../dto/transaction.dto";
import { requestService } from "../requestService/requestService";

class TransactionService {
  private readonly url: string;

  constructor() {
    this.url = "/transaction";
  }

  create(data: CreateTransactionDTO) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateTransactionDTO) {
    return requestService.update<UpdateTransactionDTO, void>(this.url, data);
  }

  findAll(data: TransactionParams) {
    return requestService.getAll<
      TransactionParams,
      GetTrasnactionDTO | GetTrasnactionDTO[]
    >(this.url, data);
  }
}

export const transactionService = new TransactionService();
