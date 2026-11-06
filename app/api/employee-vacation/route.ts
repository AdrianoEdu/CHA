// Copyright (c) 2026-11-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { employeeVacationControler } from "../resources/employee-vacation/employee-vacation.controller";

export async function POST(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) {
      throw new Error("Payload ausente no request");
    }

    const decrypted = await decryptMiddleware(payload);

    const result = await employeeVacationControler.create(decrypted);

    return Response.json(result);
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("[EMPLOYEE VACATION] Erro no POST:", error);

    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) {
      throw new Error("Payload ausente no request");
    }

    const decrypted = await decryptMiddleware(payload);

    await employeeVacationControler.update(decrypted.id, decrypted);

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("[EMPLOYEE VACATION] Erro no PUT:", error);

    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    console.log("[EMPLOYEE VACATION] GET chamado:", req.url);

    authGuard(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("[EMPLOYEE VACATION] ID recebido:", id);

    if (!id) {
      return Response.json(
        { error: "ID do funcionário não informado." },
        { status: 400 },
      );
    }

    const result = await employeeVacationControler.get(id);

    console.log("[EMPLOYEE VACATION] Resultado:", result);

    return Response.json(result);
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("[EMPLOYEE VACATION] Erro no GET:", error);

    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
