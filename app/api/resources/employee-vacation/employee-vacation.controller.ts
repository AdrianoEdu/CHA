// Copyright (c) 2026-11-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateEmployeeVacation,
  GetEmployeeVacation,
  UpdateEmplyeeVacation,
} from "../../dto/EmployeeVacation/EmployeeVacation";
import { employeeVacationService } from "./employee-vacation.service";

class EmployeeVacationController {
  private employeeVacationService;

  constructor() {
    this.employeeVacationService = employeeVacationService;
  }

  async create(data: CreateEmployeeVacation) {
    return this.employeeVacationService.create(data);
  }

  async update(id: string, data: UpdateEmplyeeVacation) {
    return this.employeeVacationService.update({ ...data, id });
  }
  async get(id: string): Promise<GetEmployeeVacation> {
    return this.employeeVacationService.get(id);
  }
}

export const employeeVacationControler = new EmployeeVacationController();
