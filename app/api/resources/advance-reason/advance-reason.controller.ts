// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateAdvanceReasonDto,
  RemoveAdvanceReason,
  UpdateAdvanceReasonDto,
} from "../../dto/AdvanceReason/AdvanceReason";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { advanceReasonService } from "./advance-reason.service";
import { parsePrismaQuery } from "../../utils/parseFindParams";

class AdvanceReasonController {
  async create(data: CreateAdvanceReasonDto) {
    return advanceReasonService.create(data);
  }

  async update(data: UpdateAdvanceReasonDto) {
    return advanceReasonService.update(data);
  }

  async findAll(req: Request) {
    try {
      const query = parsePrismaQuery<
        Prisma.AdvanceReasonWhereInput,
        Prisma.AdvanceReasonSelect,
        Prisma.AdvanceReasonInclude,
        Prisma.AdvanceReasonOrderByWithRelationInput
      >(req);

      return advanceReasonService.findAdvanceReason(query);
    } catch (error: any) {
      console.error("Erro ao buscar Advance Reason:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findByName(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get("name") ?? "";

      return advanceReasonService.findByName({ name });
    } catch (error: any) {
      console.error("Erro ao buscar Advance Reason:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async remove({ id }: RemoveAdvanceReason) {
    return await advanceReasonService.remove(id);
  }
}

export const advanceReasonController = new AdvanceReasonController();
