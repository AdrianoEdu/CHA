// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import {
  CreateAdvanceReasonDto,
  FindAdvanceReasonDto,
} from "../../dto/advance-reason.dto";

class AdvanceReasonService {
  private readonly url: string;

  constructor() {
    this.url = "/advance-reason";
  }

  create(data: CreateAdvanceReasonDto) {
    return requestService.post(this.url, data);
  }

  findAll() {
    return requestService.getAll<void, FindAdvanceReasonDto[]>(this.url);
  }
}

export const advanceReasonService = new AdvanceReasonService();
