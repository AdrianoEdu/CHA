// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import {
  CreateEmployeeDto,
  EmployeeDto,
  EmployeeParams,
  GetEmployeeDtoParams,
  UpdateEmployeeDto,
} from "../../dto/employee.dto";

class EmployeeService {
  private readonly url: string;

  constructor() {
    this.url = "/employee";
  }

  create(data: CreateEmployeeDto) {
    return requestService.post(this.url, data);
  }

  findAll(data: EmployeeParams) {
    return requestService.getAll<EmployeeParams, GetEmployeeDtoParams>(
      this.url,
      data,
    );
  }

  patch({
    id,
    name,
    isActive,
    document,
    dateOfBirth,
    employeePositionId,
  }: Partial<UpdateEmployeeDto>) {
    return requestService.patch<Partial<UpdateEmployeeDto>, void>(this.url, {
      id,
      name,
      document,
      isActive,
      dateOfBirth,
      employeePositionId,
    });
  }

  delete(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const employeeService = new EmployeeService();
