import { cookies } from "next/headers";
import { encrypt } from "../lib/decrypt";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { AuthController } from "../resources/auth/auth-controller";

const authController = new AuthController();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = body?.payload;

    if (!payload) {
      return Response.json(
        { error: "Payload ausente no request" },
        { status: 400 },
      );
    }

    const decrypted = await decryptMiddleware(payload);
    const result = await authController.login(decrypted);

    const cookieStore = await cookies();

    cookieStore.set("auth_token", result, {
      httpOnly: true,
      path: "/",
    });

    const encrypted = encrypt(result);

    return Response.json({ payload: encrypted });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
