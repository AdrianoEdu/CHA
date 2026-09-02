// Copyright (c) 2026-07-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { parsePrismaQuery } from "../../utils/parseFindParams";
import { cashBookService } from "./cash-book.service";

class CashBookController {
  private readonly cashBookService;

  constructor() {
    this.cashBookService = cashBookService;
  }

  async create(data: CreateCashBookDto) {
    return this.cashBookService.create(data);
  }

  async update(data: UpdateCashBookDto) {
    return this.cashBookService.update(data);
  }

  async findAll(req: Request) {
    try {
      const params = parsePrismaQuery<
        Prisma.CashBookWhereInput,
        Prisma.CashBookSelect,
        Prisma.CashBookInclude,
        Prisma.CashBookOrderByWithRelationInput
      >(req);
      return await this.cashBookService.findCashBook(params);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const cashBookController = new CashBookController();
