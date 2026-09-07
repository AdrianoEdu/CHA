// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { CreateAccountDto, UpdateAccountDto } from "../../dto/Account/Account";
import { parsePrismaQuery } from "../../utils/parseFindParams";
import { accountService } from "./account.service";

class AccountController {
  private accountService;

  constructor() {
    this.accountService = accountService;
  }

  async create(data: CreateAccountDto) {
    return this.accountService.create(data);
  }

  async update(data: UpdateAccountDto) {
    return this.accountService.update(data);
  }

  async findAll(req: Request) {
    try {
      const params = parsePrismaQuery<
        Prisma.AccountWhereInput,
        Prisma.AccountSelect,
        Prisma.AccountInclude,
        Prisma.AccountOrderByWithRelationInput
      >(req);
      return await this.accountService.findAccount(params);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const accountController = new AccountController();
