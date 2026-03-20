// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionEnum } from "../dto/Auth/Auth";
import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { customerController } from "../resources/customer/customer.controller";

export async function POST(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);
    const result = await customerController.create(decrypted);
    return Response.json(result);
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json({ error: error.message });
    }

    return Response.json({ error: `Erro interno: ${error}` }, { status: 500 });
  }
}

export async function UPDATE(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);
    const result = await customerController.update(decrypted);
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

    const { searchParams } = new URL(req.url);
    const type = Number(searchParams.get("type"));

    let result;

    switch (type) {
      case ActionEnum.FindAll:
        result = await customerController.findAll(req);
        break;
      case ActionEnum.FindByName:
        result = await customerController.findByName(req);
        break;
      default:
        break;
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
    });
  }
}
