// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import {
  EmployeeDto,
  EmployeeParams,
  GetEmployeeDtoParams,
} from "../../dto/employee.dto";

class EmployeeService {
  private readonly url: string;

  constructor() {
    this.url = "/employee";
  }

  create(data: EmployeeDto) {
    return requestService.post(this.url, data);
  }

  findAll(data: EmployeeParams) {
    return requestService.getAll<EmployeeParams, GetEmployeeDtoParams>(
      this.url,
      data,
    );
  }

  patch({ isActive, id }: Partial<EmployeeDto>) {
    return requestService.patch<Partial<EmployeeDto>, void>(this.url, {
      isActive,
      id,
    });
  }

  delete(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const employeeService = new EmployeeService();
