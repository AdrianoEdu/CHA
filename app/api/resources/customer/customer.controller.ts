// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "../../dto/Customer/Customer";
import { customerService } from "./customer.service";
import { RemoveAdvanceReason } from "../../dto/AdvanceReason/AdvanceReason";

class CustomerController {
  private customerService;

  constructor() {
    this.customerService = customerService;
  }

  async create(data: CreateCustomerDto) {
    return this.customerService.create(data);
  }

  async update(data: UpdateCustomerDto) {
    return this.customerService.update(data);
  }

  async findAll(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const skip = searchParams.get("skip");
      const take = searchParams.get("take");

      return await this.customerService.findAll({
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined,
      });
    } catch (error: any) {
      console.error("Erro ao buscar Customer:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findByName(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get("name") ?? "";

      return await this.customerService.findByName({ name });
    } catch (error) {}
  }

  async remove({ id }: RemoveAdvanceReason) {
    return await customerService.remove({ id });
  }
}

export const customerController = new CustomerController();
