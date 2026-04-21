// Copyright (c) 2026-03-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateEmployeeAdvanceDto,
  EmployeeAdvanceParams,
  GetAllEmployeeAdvanceDto,
  UpdateEmployeeAdvanveDto,
} from "../../dto/employee-advance.dto";
import { requestService } from "../requestService/requestService";

class EmployeeAdvanceService {
  private readonly url: string;

  constructor() {
    this.url = "/employee-advance";
  }

  create(data: CreateEmployeeAdvanceDto) {
    return requestService.post(this.url, data);
  }

  patch(data: Partial<UpdateEmployeeAdvanveDto>) {
    return requestService.patch(this.url, data);
  }

  findAll(params: EmployeeAdvanceParams) {
    return requestService.getAll<
      EmployeeAdvanceParams,
      GetAllEmployeeAdvanceDto | GetAllEmployeeAdvanceDto[]
    >(this.url, params);
  }
}

export const employeeAdvanceService = new EmployeeAdvanceService();
