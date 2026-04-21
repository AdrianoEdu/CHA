// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { bankService } from "./bank.service";
import { RemoveBankDto } from "../../dto/Bank/bank";
import { parsePrismaQuery } from "../../utils/parseFindParams";

export class BankController {
  private bankService;

  constructor() {
    this.bankService = bankService;
  }

  async create(decryptedBody: any) {
    try {
      const employee = await this.bankService.create(decryptedBody);
      return Response.json(employee, { status: 201 });
    } catch (error: any) {
      console.error("Erro ao criar Employee:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async update(decryptedBody: any) {
    try {
      await this.bankService.update(decryptedBody);
      return Response.json(
        { message: "Employee atualizado com sucesso" },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Erro ao atualizar Employee:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findAll(req: Request) {
    try {
      const params = parsePrismaQuery<
        Prisma.BankWhereInput,
        Prisma.BankSelect,
        Prisma.BankInclude,
        Prisma.BankOrderByWithRelationInput
      >(req);

      return await this.bankService.findBank(params);
    } catch (error: any) {
      console.error("Erro ao buscar Employees:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async remove({ id }: RemoveBankDto) {
    return await this.bankService.remove({ id });
  }
}

export const bankController = new BankController();
