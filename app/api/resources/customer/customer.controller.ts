// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { SendPaginationDto } from "@/app/web/dto/pagination.dto";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "../../dto/Customer/Customer";
import { customerService } from "./customer.service";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { Prisma } from "@/app/generated/prisma";

class CustomerController {
  private customerService;

  constructor() {
    this.customerService = customerService;
  }

  async create(data: CreateCustomerDto) {
    return this.customerService.create(data);
  }

  async update(data: UpdateCustomerDto): Promise<void> {
    await this.customerService.update(data);
  }

  async findAll(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const skip = searchParams.get("skip");
      const take = searchParams.get("take");

      return this.customerService.findAll({
        skip: Number(skip),
        take: Number(take),
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
}

export const customerController = new CustomerController();
