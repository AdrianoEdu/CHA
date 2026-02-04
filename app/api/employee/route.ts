import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { employeeService } from "../resources/employee/employee-service";

export async function POST(req: Request) {
  const body = await req.json();

  const payload = body?.payload;

  if (!payload) throw new Error('Payload ausente no request');

  const decrypted = await decryptMiddleware(payload);

  const result = await employeeService.create(decrypted);
  return Response.json(result);
}
