// Copyright (c) 2026-03-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateCustomerDto,
  GetCustomerDto,
  SendCreateCustomerDto,
  UpdateCustomerDto,
} from "../../dto/customer.dto";
import { SendPaginationDto } from "../../dto/pagination.dto";
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

  findAll(data: SendPaginationDto) {
    return requestService.getAll<SendPaginationDto, GetCustomerDto[]>(
      this.url,
      data,
    );
  }

  findByName({ name }: Partial<SendCreateCustomerDto>) {
    return requestService.getByFilters<
      Partial<SendCreateCustomerDto>,
      GetCustomerDto[]
    >(this.url, { name });
  }
}

export const customerService = new CustomerService();
