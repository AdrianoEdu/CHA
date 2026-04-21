// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import {
  AdvanceReasonParams,
  CreateAdvanceReasonDto,
  FindAdvanceReasonDto,
  UpdateAdavanceReasonDto,
} from "../../dto/advance-reason.dto";

class AdvanceReasonService {
  private readonly url: string;

  constructor() {
    this.url = "/advance-reason";
  }

  create(data: CreateAdvanceReasonDto) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateAdavanceReasonDto) {
    return requestService.update(this.url, data);
  }

  findAll(params: AdvanceReasonParams) {
    return requestService.getAll<AdvanceReasonParams, FindAdvanceReasonDto[]>(
      this.url,
      params,
    );
  }

  delete(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const advanceReasonService = new AdvanceReasonService();
