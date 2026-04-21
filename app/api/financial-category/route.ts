import { ActionEnum } from "../dto/Auth/Auth";
import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { financialCategoryController } from "../resources/financial-category/financial-category.controller";

export async function POST(req: Request) {
  try {
    authGuard(req);

    const body = await req.json();
    const payload = body?.payload;

    if (!payload) throw new Error("Payload ausente no request");

    const decrypted = await decryptMiddleware(payload);
    const result = await financialCategoryController.create(decrypted);
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
    const result = await financialCategoryController.update(decrypted);
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

    const result = await financialCategoryController.findAll(req);

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

    await financialCategoryController.remove(decrypted);

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
