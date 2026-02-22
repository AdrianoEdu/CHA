import { cookies } from "next/headers";
import { encrypt } from "../lib/decrypt";
import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { AuthController } from "../resources/auth/auth-controller";
import { ActionEnum } from "@/app/api/dto/Auth/Auth";

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

    let result: any;

    const cookieStore = await cookies();

    switch (decrypted.type) {
      case ActionEnum.Login: {
        await cookieStore.delete("auth_token");

        result = await authController.login(decrypted);

        cookieStore.set("auth_token", result.token, {
          httpOnly: true,
          path: "/",
        });
        break;
      }
      case ActionEnum.IsLogged: {
        const token = cookieStore.get("auth_token")?.value ?? "";

        result = await authController.isLogged(token);
        break;
      }
      case ActionEnum.Logout: {
        const token = cookieStore.get("auth_token")?.value ?? "";

        result = await authController.logout(token);

        await cookieStore.delete("auth_token");

        break;
      }
      default:
        break;
    }

    const encrypted = encrypt(result);

    return Response.json({ payload: encrypted });
  } catch (error) {
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
