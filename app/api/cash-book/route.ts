import { HttpException } from "../error/HttpException";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { authGuard } from "../middleware/validate-token-middleware";
import { cashBookController } from "../resources/cash-book/cash-book.controller";

export async function GET(req: Request) {
  try {
    authGuard(req);

    const result = await cashBookController.findAll(req);

    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    authGuard(req);

    const formData = await req.formData();

    const payloadRaw = formData.get("payload");
    const file = formData.get("file");

    if (typeof payloadRaw !== "string") {
      throw new Error("Payload ausente no request");
    }

    const payload = JSON.parse(payloadRaw);

    const decrypted = await decryptMiddleware(payload);

    await cashBookController.create({
      ...decrypted,
      file: file instanceof File ? file : undefined,
    });

    return Response.json({ status: 200 });
  } catch (error) {
    console.error("CASH BOOK POST ERROR:", error);

    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    authGuard(req);

    const formData = await req.formData();

    const payload = formData.get("payload");
    const file = formData.get("file");

    if (typeof payload !== "string") {
      throw new Error("Payload ausente no request");
    }

    const decrypted = await decryptMiddleware(payload);

    const result = await cashBookController.update({
      ...decrypted,
      file: file instanceof File ? file : undefined,
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("CASH BOOK PUT ERROR:", error);

    if (error instanceof HttpException) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
