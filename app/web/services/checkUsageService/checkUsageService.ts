// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CheckUsageDTO,
  CheckUsageParams,
  CreateCheckUsageDTO,
  UpdateCheckUsageDTO,
} from "../../dto/check-usage.dto";
import { requestService } from "../requestService/requestService";

class CheckUsageService {
  private readonly url: string;

  constructor() {
    this.url = "/check-usage";
  }

  create(data: CreateCheckUsageDTO) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateCheckUsageDTO) {
    return requestService.update(this.url, data);
  }

  findAll(data: CheckUsageParams) {
    return requestService.getAll<
      CheckUsageParams,
      CheckUsageDTO | CheckUsageDTO[]
    >(this.url, data);
  }
}

export const checkUsageService = new CheckUsageService();
