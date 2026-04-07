// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { configSystemService } from "./config-system.service";

export class ConfigSystemController {
  private configSystemService;

  constructor() {
    this.configSystemService = configSystemService;
  }

  async update(decryptedBody: any) {
    try {
      await this.configSystemService.update(decryptedBody);
      return Response.json(
        { message: "Employee atualizado com sucesso" },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Erro ao atualizar Employee:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findAll() {
    try {
      return await this.configSystemService.findAll();
    } catch (error: any) {
      console.error("Erro ao buscar Employees:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export const configSystemController = new ConfigSystemController();
