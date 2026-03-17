// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CreateAdvanceReasonDto } from "../../dto/AdvanceReason/AdvanceReason";
import { advanceReasonService } from "./advance-reason.service";

class AdvanceReasonController {
  async create(data: CreateAdvanceReasonDto) {
    advanceReasonService.create(data);
  }

  async findAll() {
    return advanceReasonService.findAll();
  }
}

export const advanceReasonController = new AdvanceReasonController();
