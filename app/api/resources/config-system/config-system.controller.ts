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

  async createBackup() {
    try {
      const backup = await this.configSystemService.createBackup();
      const fileName = `backup-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`;

      return new Response(new Uint8Array(backup), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": backup.length.toString(),
          "Cache-Control": "no-store",
        },
      });
    } catch (error: unknown) {
      console.error("Erro ao gerar backup:", error);

      return Response.json(
        {
          error:
            error instanceof Error ? error.message : "Erro ao gerar o backup.",
        },
        { status: 500 },
      );
    }
  }

  async restoreBackup(file: File): Promise<Response> {
    try {
      await this.configSystemService.restoreBackup(file);

      return Response.json({
        message: "Backup restaurado com sucesso.",
      });
    } catch (error: unknown) {
      console.error("Erro ao restaurar backup:", error);

      return Response.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erro ao restaurar backup.",
        },
        { status: 500 },
      );
    }
  }
}

export const configSystemController = new ConfigSystemController();
