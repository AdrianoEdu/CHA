// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "../../dto/Transaction/Tansaction";
import { transactionService } from "./transaction.service";

class TransactionController {
  create(data: CreateTransactionDTO) {
    return transactionService.create(data);
  }

  update(data: UpdateTransactionDTO) {
    return transactionService.update(data);
  }

  findAll(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const skip = searchParams.get("skip");
      const take = searchParams.get("take");

      return transactionService.findAll({
        skip: Number(skip),
        take: Number(take),
      });
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const transactionController = new TransactionController();
