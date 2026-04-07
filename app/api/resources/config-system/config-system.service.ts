// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { SystemConfigDto } from "../../dto/ConfigSystem/ConfigSystem";
import { databaseService } from "../../providers/database/DatabaseService";

class ConfigSystemService {
  private databaseService = databaseService;

  async findAll(): Promise<SystemConfigDto[]> {
    return await this.databaseService.systemConfig.findMany();
  }

  async update(data: SystemConfigDto): Promise<void> {
    await this.databaseService.systemConfig.update({
      where: { id: data.id },
      data,
    });
  }
}

export const configSystemService = new ConfigSystemService();
