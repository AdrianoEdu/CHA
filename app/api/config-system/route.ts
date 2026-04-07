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

    let result = await configSystemController.findAll();

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
    });
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
