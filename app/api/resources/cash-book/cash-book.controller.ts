// Copyright (c) 2026-07-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { parsePrismaQuery } from "../../utils/parseFindParams";
import { cashBookService } from "./cash-book.service";
import {
  CreateCashBookDto,
  UpdateCashBookDto,
} from "../../dto/CashBook/CashBook";

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
}

export const cashBookController = new CashBookController();
