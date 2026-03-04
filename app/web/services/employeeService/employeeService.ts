// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import { PaginationDto } from "../../dto/pagination.dto";
import { EmployeeDto } from "../../dto/employee.dto";

class EmployeeService {
  private readonly url: string;

  constructor() {
    this.url = "/employee";
  }

  create(data: EmployeeDto) {
    return requestService.post(this.url, data);
  }

  findAll(data: PaginationDto) {
    return requestService.getAll<EmployeeDto[]>(this.url, data);
  }
}

export const employeeService = new EmployeeService();
