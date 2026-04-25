// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "../../dto/Transaction/Tansaction";
import { parsePrismaQuery } from "../../utils/parseFindParams";
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
      const params = parsePrismaQuery<
        Prisma.TransactionWhereInput,
        Prisma.TransactionSelect,
        Prisma.TransactionInclude,
        Prisma.TransactionOrderByWithRelationInput
      >(req);

      return transactionService.findTransaction(params);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const transactionController = new TransactionController();
