// Copyright (c) 2026-03-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionEnum } from "../dto/Auth/Auth";
import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { employeeAdvanceController } from "../resources/employee-advance/employee-advanced.controller";

export async function POST(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();

    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);

    const result = await employeeAdvanceController.create(decrypted);
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

    await employeeAdvanceController.update(decrypted.id, decrypted);

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
        result = await employeeAdvanceController.findAll(req);
        break;
      case ActionEnum.FindByFilters:
        result = await employeeAdvanceController.findByName(req);
        break;
      default:
        break;
    }

    const banks = await employeeAdvanceController.findAll(req);

    return new Response(JSON.stringify(banks), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
    });
  }
}
