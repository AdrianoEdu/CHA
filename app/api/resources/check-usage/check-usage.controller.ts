// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateCheckUsageDTO,
  UpdateCheckUsageDTO,
} from "../../dto/CheckUsage/CheckUsage";
import { databaseService } from "../../providers/database/DatabaseService";
import { parsePrismaQuery } from "../../utils/parseFindParams";
import { checkUsageService } from "./check-usage.service";

class CheckUsageController {
  create(data: CreateCheckUsageDTO) {
    return checkUsageService.create(data);
  }

  update(data: UpdateCheckUsageDTO) {
    return checkUsageService.update(data);
  }

  findAll(req: Request) {
    try {
      const params = parsePrismaQuery<
        Prisma.CheckUsageWhereInput,
        Prisma.CheckUsageSelect,
        Prisma.CheckUsageInclude,
        Prisma.CheckUsageOrderByWithRelationInput
      >(req);

      return checkUsageService.findCheckUsage(params);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const checkUsageController = new CheckUsageController();
