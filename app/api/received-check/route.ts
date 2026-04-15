// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionEnum } from "../dto/Auth/Auth";
import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { receivedCheckController } from "../resources/received-check/received-check.controller";

export async function POST(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();

    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);

    const result = await receivedCheckController.create(decrypted);
    return Response.json(result);
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

    await receivedCheckController.update(decrypted);

    return Response.json({ success: true });
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

export async function GET(req: Request) {
  try {
    authGuard(req);

    const { searchParams } = new URL(req.url);
    const type = Number(searchParams.get("type"));

    let result;

    switch (type) {
      case ActionEnum.FindAll:
        result = await receivedCheckController.findAll(req);
        break;
      case ActionEnum.FindByFilters:
        result = await receivedCheckController.findByFilters(req);
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

export async function DELETE(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();

    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);

    await receivedCheckController.remove(decrypted);

    return Response.json({ success: true });
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
