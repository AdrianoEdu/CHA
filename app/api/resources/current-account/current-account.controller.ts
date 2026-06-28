// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateCurrentAccountDto,
  UpdateCurrentAccountDto,
} from "../../dto/CurrentAccount/CurrentAccount";
import { parsePrismaQuery } from "../../utils/parseFindParams";
import { currentAccountService } from "./current-account.service";

class CurrentAccountController {
  private currentAccountService;

  constructor() {
    this.currentAccountService = currentAccountService;
  }

  async create(data: CreateCurrentAccountDto) {
    return this.currentAccountService.create(data);
  }

  async update(data: UpdateCurrentAccountDto) {
    return this.currentAccountService.update(data);
  }

  async findAll(req: Request) {
    try {
      const params = parsePrismaQuery<
        Prisma.CurrentAccountWhereInput,
        Prisma.CurrentAccountSelect,
        Prisma.CurrentAccountInclude,
        Prisma.CurrentAccountOrderByWithRelationInput
      >(req);
      return await this.currentAccountService.findMany(params);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const currentAccountController = new CurrentAccountController();
