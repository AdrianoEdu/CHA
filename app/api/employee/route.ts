import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { employeeService } from "../providers/EmployeeService";

export async function POST(req: Request) {
  const body = await req.json();

  const payload = body?.payload;

  if (!payload) {
    console.error('Payload ausente!', body);
    throw new Error('Payload ausente no request');
  }

  console.log(payload, 'payload');

  const decrypted = await decryptMiddleware(payload);

  const result = await employeeService.create(decrypted);
  return Response.json(result);
}
