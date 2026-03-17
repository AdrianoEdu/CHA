// Copyright (c) 2026-03-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  EmployeeAdvanceDto,
  GetAllEmployeeAdvanceDto,
  SendEmployeeAdvanceDto,
} from "../../dto/employee-advance.dto";
import { SendPaginationDto } from "../../dto/pagination.dto";
import { requestService } from "../requestService/requestService";

class EmployeeAdvanceService {
  private readonly url: string;

  constructor() {
    this.url = "/employee-advance";
  }

  create(data: EmployeeAdvanceDto) {
    return requestService.post(this.url, data);
  }

  patch(data: Partial<EmployeeAdvanceDto>) {
    return requestService.patch(this.url, data);
  }

  findByName({
    employeeId,
    reasonName,
    reasonId,
    type,
  }: Partial<SendEmployeeAdvanceDto>) {
    return requestService.getByFilters<
      Partial<SendEmployeeAdvanceDto>,
      GetAllEmployeeAdvanceDto[]
    >(this.url, { reasonId, reasonName, employeeId, type });
  }

  findAll({ skip, take, type }: SendPaginationDto) {
    return requestService.getAll<SendPaginationDto, GetAllEmployeeAdvanceDto[]>(
      this.url,
      { skip, take, type },
    );
  }
}

export const employeeAdvanceService = new EmployeeAdvanceService();
