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

  async createBackup(): Promise<Blob> {
    return requestService.download(this.url);
  }
  async restoreBackup(file: File): Promise<void> {
    const formData = new FormData();

    formData.append("payload", JSON.stringify({}));
    formData.append("file", file);

    return requestService.patch<FormData, void>(`${this.url}`, formData);
  }
}

export const configSystemService = new ConfigSystemService();
