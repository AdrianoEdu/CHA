// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { configSystemController } from "../resources/config-system/config-system.controller";

export async function GET(req: Request) {
  try {
    authGuard(req);

    const result = await configSystemController.findAll();

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);

    return await configSystemController.update(decrypted);
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    authGuard(req);

    return await configSystemController.createBackup();
  } catch (error: unknown) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Erro na rota de backup:", error);

    return Response.json({ error: "Erro ao gerar backup." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    authGuard(req);

    const formData = await req.formData();
    const payload = formData.get("payload");
    const file = formData.get("file");

    if (typeof payload !== "string") {
      throw new HttpException("Payload ausente no request", 400);
    }

    if (!(file instanceof File)) {
      throw new HttpException("Arquivo de backup não enviado", 400);
    }

    const decrypted = await decryptMiddleware(JSON.parse(payload));

    return await configSystemController.restoreBackup(file);
  } catch (error: unknown) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Erro ao restaurar backup:", error);

    return Response.json(
      { error: "Erro ao restaurar backup." },
      { status: 500 },
    );
  }
}
