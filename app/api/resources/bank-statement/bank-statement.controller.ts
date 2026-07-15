// Copyright (c) 2026-07-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateBankStatementDto,
  UpdateBankStatementDto,
} from "../../dto/BankStatement/BankStatement";
import { parsePrismaQuery } from "../../utils/parseFindParams";
import { bankStatementService } from "./bank-statement.service";

class BankStatementController {
  private bankStatementService;

  constructor() {
    this.bankStatementService = bankStatementService;
  }

  async create(data: CreateBankStatementDto) {
    return this.bankStatementService.create(data);
  }

  async update(data: UpdateBankStatementDto) {
    return this.bankStatementService.update(data);
  }

  async findAll(req: Request) {
    try {
      const params = parsePrismaQuery<
        Prisma.BankStatementWhereInput,
        Prisma.BankStatementSelect,
        Prisma.BankStatementInclude,
        Prisma.BankStatementOrderByWithRelationInput
      >(req);
      return await this.bankStatementService.findMany(params);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const bankStatementConttroller = new BankStatementController();
