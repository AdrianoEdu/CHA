// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetHealthDto } from "../../dto/Health/Health";
import { healthService } from "./health.service";

export class HealthController {
  private healthService;

  constructor() {
    this.healthService = healthService;
  }

  async getHealth(): Promise<GetHealthDto> {
    return await this.healthService.getHealth();
  }
}

export const healthController = new HealthController();
