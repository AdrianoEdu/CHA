// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionEnum } from "../dto/Auth/Auth";
import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { checkUsageController } from "../resources/check-usage/check-usage.controller";

export async function POST(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);
    const result = await checkUsageController.create(decrypted);
    return Response.json(result);
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json({ error: error.message });
    }

    return Response.json({ error: `Erro interno: ${error}` }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);
    const result = await checkUsageController.update(decrypted);
    return Response.json(result);
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json({ error: error.message });
    }

    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    authGuard(req);

    const result = await checkUsageController.findAll(req);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
    });
  }
}
