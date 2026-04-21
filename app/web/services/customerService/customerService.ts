// Copyright (c) 2026-03-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateCustomerDto,
  CustomerParams,
  GetCustomerDto,
  UpdateCustomerDto,
} from "../../dto/customer.dto";
import { requestService } from "../requestService/requestService";

class CustomerService {
  private readonly url: string;

  constructor() {
    this.url = "/customer";
  }

  update(data: UpdateCustomerDto) {
    return requestService.update<UpdateCustomerDto, void>(this.url, data);
  }

  create(data: CreateCustomerDto) {
    return requestService.post<CreateCustomerDto, void>(this.url, data);
  }

  findAll(data?: CustomerParams): Promise<GetCustomerDto | GetCustomerDto[]> {
    return requestService.getAll<
      CustomerParams,
      GetCustomerDto | GetCustomerDto[]
    >(this.url, data);
  }

  delete(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const customerService = new CustomerService();
