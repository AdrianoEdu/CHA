// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetHealthDto } from "../../dto/health.dto";
import { requestService } from "../requestService/requestService";

class HealthService {
  private readonly url: string;

  constructor() {
    this.url = "/health";
  }

  getHealth(): Promise<GetHealthDto> {
    return requestService.get<GetHealthDto>(this.url);
  }
}

export const healthService = new HealthService();
