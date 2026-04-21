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
import { Prisma } from "@/app/generated/prisma";
import { parsePrismaQuery } from "../../utils/parseFindParams";

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
      const params = parsePrismaQuery<
        Prisma.CustomerWhereInput,
        Prisma.CustomerSelect,
        Prisma.CustomerInclude,
        Prisma.CustomerOrderByWithRelationInput
      >(req);

      return await this.customerService.findCustomer(params);
    } catch (error: any) {
      console.error("Erro ao buscar Customer:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async remove({ id }: RemoveAdvanceReason) {
    return await customerService.remove({ id });
  }
}

export const customerController = new CustomerController();
