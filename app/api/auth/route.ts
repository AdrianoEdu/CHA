import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { AuthController } from "../resources/auth/auth-controller";

const authController = new AuthController();

export async function POST(req: Request) {
  const body = await req.json();
  const payload = body?.payload;

  if (!payload) throw new Error('Payload ausente no request');

  const decrypted = await decryptMiddleware(payload);
  const result = await authController.login(decrypted);

  return Response.json(result);
}
