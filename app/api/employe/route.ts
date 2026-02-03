import { decryptMiddleware } from "../middleware/decrypt-middleware";
import { EmployeeController } from "../resources/employee/employee-controller";
import { employeeService } from "../resources/employee/employee-service";

const employeeController = new EmployeeController();

export async function POST(req: Request) {
  const body = await decryptMiddleware(req);

  const result = await employeeController.create(body);

  return Response.json(result);
}
