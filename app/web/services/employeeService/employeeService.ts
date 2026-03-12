// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import { PaginationDto, SendPaginationDto } from "../../dto/pagination.dto";
import { EmployeeDto, SendEmployeeDto } from "../../dto/employee.dto";
import { ActionDto } from "../../dto/auth.dto";

class EmployeeService {
  private readonly url: string;

  constructor() {
    this.url = "/employee";
  }

  create(data: SendEmployeeDto) {
    return requestService.post(this.url, data);
  }

  findAll(data: SendPaginationDto) {
    return requestService.getAll<SendPaginationDto, EmployeeDto[]>(
      this.url,
      data,
    );
  }

  patch({ isActive, id }: Partial<SendEmployeeDto>) {
    return requestService.patch<Partial<EmployeeDto>, void>(this.url, {
      isActive,
      id,
    });
  }

  delete(id: string) {
    return requestService.delete(this.url, id);
  }

  findByName({ name, type }: Partial<SendEmployeeDto>) {
    return requestService.getByFilters<SendEmployeeDto, EmployeeDto[]>(
      this.url,
      {
        name: name!,
        type,
      },
    );
  }
}

export const employeeService = new EmployeeService();
