// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateAdvanceReasonDto,
  FindAdvanceReasonByFilters,
  FindAdvanceReasonDto,
  UpdateAdvanceReasonDto,
} from "../../dto/AdvanceReason/AdvanceReason";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import { NotFoundException } from "../../error/NotFoundException";

class AdvanceReasonService {
  private databaseService;

  constructor() {
    this.databaseService = databaseService;
  }

  async create(data: CreateAdvanceReasonDto) {
    return this.databaseService.advanceReason.create({ data });
  }

  async update({ id, name }: UpdateAdvanceReasonDto) {
    return this.databaseService.advanceReason.update({
      where: { id },
      data: { name },
    });
  }

  async findAdvanceReason(
    params: PaginationDto<
      Prisma.AdvanceReasonWhereInput,
      Prisma.AdvanceReasonSelect,
      Prisma.AdvanceReasonInclude,
      Prisma.AdvanceReasonOrderByWithRelationInput
    >,
  ): Promise<FindAdvanceReasonDto | FindAdvanceReasonDto[]> {
    const baseQuery: Prisma.AdvanceReasonFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    if (!params.all) return this.findFirst(baseQuery);

    return this.findMany(baseQuery);
  }

  async findMany(
    baseQuery: Prisma.AdvanceReasonFindManyArgs,
  ): Promise<FindAdvanceReasonDto[]> {
    return this.databaseService.advanceReason.findMany({ ...baseQuery });
  }

  async findFirst(
    baseQuery: Prisma.AdvanceReasonFindManyArgs,
  ): Promise<FindAdvanceReasonDto> {
    const result = await this.databaseService.advanceReason.findFirst({
      ...baseQuery,
    });

    if (!result) throw new NotFoundException();

    return result;
  }

  async findByName({ name }: FindAdvanceReasonByFilters) {
    return this.databaseService.advanceReason.findMany({ where: { name } });
  }

  async remove(id: string): Promise<void> {
    const count = await this.databaseService.employeeAdvance.count({
      where: { reasonId: id },
    });

    if (count > 0) {
      throw new HttpException(
        "Já existem registros de adiantamento associados a este motivo.",
        400,
      );
    }

    const reason = await this.databaseService.advanceReason.findUnique({
      where: { id },
    });

    if (!reason) {
      throw new HttpException("Motivo de adiantamento não encontrado.", 404);
    }

    await this.databaseService.advanceReason.delete({
      where: { id },
    });
  }
}

export const advanceReasonService = new AdvanceReasonService();
