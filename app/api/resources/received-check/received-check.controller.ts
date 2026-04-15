// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { receivedCheckService } from "./received-check.service";
import { RemoveReceivedCheckDto } from "../../dto/ReceivedCheck/ReceivedCheck";

export class ReceivedCheckController {
  private receivedCheckService;

  constructor() {
    this.receivedCheckService = receivedCheckService;
  }

  async create(decryptedBody: any) {
    try {
      await this.receivedCheckService.create(decryptedBody);
      return Response.json("success", { status: 201 });
    } catch (error: any) {
      console.error("Erro ao criar recebimento de cheque:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async update(decryptedBody: any) {
    try {
      await this.receivedCheckService.update(decryptedBody);
      return Response.json(
        { message: "Recebimento de cheque atualizado com sucesso" },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Erro ao atualizar o recebimento de um cheque:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findAll(req: Request) {
    try {
      const { searchParams } = new URL(req.url);

      const skip = Number(searchParams.get("skip"));
      const take = Number(searchParams.get("take"));

      return await this.receivedCheckService.findAll({ skip, take });
    } catch (error: any) {
      console.error("Erro ao buscar cheques recebidos:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findByFilters(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const checkNumber = searchParams.get("checkNumber") ?? "";

      return receivedCheckService.findByFilters({ checkNumber });
    } catch (error: any) {
      console.error("Erro ao buscar cheque recebido:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async remove({ id }: RemoveReceivedCheckDto) {
    return await this.receivedCheckService.remove({ id });
  }
}

export const receivedCheckController = new ReceivedCheckController();
