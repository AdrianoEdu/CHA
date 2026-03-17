// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateAdvanceReasonDto,
  FindAdvanceReason,
} from "../../dto/AdvanceReason/AdvanceReason";
import { databaseService } from "../../providers/database/DatabaseService";

class AdvanceReasonService {
  private databaseService;

  constructor() {
    this.databaseService = databaseService;
  }

  async create(data: CreateAdvanceReasonDto) {
    return this.databaseService.advanceReason.create({ data });
  }

  async findAll(): Promise<FindAdvanceReason[]> {
    return this.databaseService.advanceReason.findMany();
  }
}

export const advanceReasonService = new AdvanceReasonService();
