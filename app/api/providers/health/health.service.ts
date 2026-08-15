// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetHealthDto } from "../../dto/Health/Health";
import { databaseService } from "../database/DatabaseService";
import { storageSrevice } from "../storage/storage.service";

export class HealthService {
  private storageService = storageSrevice;
  private databaseService = databaseService;

  async getHealth(): Promise<GetHealthDto> {
    return {
      database: await this.getDatabase(),
      storage: await storageSrevice.isOnline(),
    };
  }

  private async getDatabase(): Promise<boolean> {
    try {
      await databaseService.$queryRaw`SELECT 1`;

      return true;
    } catch {
      return false;
    }
  }
}

export const healthService = new HealthService();
