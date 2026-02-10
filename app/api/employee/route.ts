import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { EmployeeController } from "../resources/employee/employee-controller";

const employeeController = new EmployeeController();

export async function POST(req: Request) {
  const body = await req.json();

  const payload = body?.payload;

  if (!payload) throw new Error('Payload ausente no request');

  const decrypted = await decryptMiddleware(payload);

  const result = await employeeController.create(decrypted);
  return Response.json(result);
}
