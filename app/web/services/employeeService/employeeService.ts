// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeeDto } from "@/app/api/dto/Employee/Employee";
import { requestService } from "../requestService/requestService";

class EmployeeService {
  private readonly url: string;

  constructor() {
    this.url = "/employee";
  }

  create<T>(data: EmployeeDto) {
    return requestService.post(this.url, data);
  }
}

export const employeeService = new EmployeeService();
