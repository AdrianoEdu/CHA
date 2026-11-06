// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateEmployeeVacation,
  GetEmployeeVacation,
  ResponseGetEmployeeVacation,
  UpdateEmplyeeVacation,
} from "../../dto/emplpoyee-vacation-dto";
import { requestService } from "../requestService/requestService";

class EmployeeVacationService {
  private readonly url: string;

  constructor() {
    this.url = "/employee-vacation";
  }

  create(data: CreateEmployeeVacation) {
    return requestService.post(this.url, data);
  }

  getById({ id }: ResponseGetEmployeeVacation) {
    return requestService.getByFilters<
      ResponseGetEmployeeVacation,
      GetEmployeeVacation
    >(this.url, { id });
  }

  patch(data: UpdateEmplyeeVacation) {
    return requestService.patch<Partial<UpdateEmplyeeVacation>, void>(
      this.url,
      { ...data },
    );
  }
}

export const employeeVacationService = new EmployeeVacationService();
