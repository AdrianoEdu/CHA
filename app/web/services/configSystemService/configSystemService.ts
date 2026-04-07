// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { SystemConfigDto } from "../../dto/config-system.dto";
import { requestService } from "../requestService/requestService";

class ConfigSystemService {
  private readonly url: string;

  constructor() {
    this.url = "/config-system";
  }

  get(): Promise<SystemConfigDto[]> {
    return requestService.getAll<void, SystemConfigDto[]>(this.url);
  }

  update(data: SystemConfigDto) {
    return requestService.update<SystemConfigDto, void>(this.url, data);
  }
}

export const configSystemService = new ConfigSystemService();
