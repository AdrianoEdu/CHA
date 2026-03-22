// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import {
  CreateAdvanceReasonDto,
  FindAdvanceReasonDto,
  SendAdvanceReasonDto,
  UpdateAdavanceReasonDto,
} from "../../dto/advance-reason.dto";
import { SendPaginationDto } from "../../dto/pagination.dto";

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

  findAll(data: SendPaginationDto) {
    return requestService.getAll<SendPaginationDto, FindAdvanceReasonDto[]>(
      this.url,
      data,
    );
  }

  findByName(data: SendAdvanceReasonDto) {
    return requestService.getByFilters<
      SendAdvanceReasonDto,
      FindAdvanceReasonDto[]
    >(this.url, data);
  }

  delete(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const advanceReasonService = new AdvanceReasonService();
