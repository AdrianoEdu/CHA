// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateCustomerDto,
  GetCustomerDto,
  UpdateCustomerDto,
} from "../../dto/Customer/Customer";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";

class CustomerService {
  private databaseService;

  constructor() {
    this.databaseService = databaseService;
  }

  create(data: CreateCustomerDto) {
    return this.databaseService.customer.create({ data });
  }

  update({ id, ...data }: UpdateCustomerDto) {
    return this.databaseService.customer.update({
      where: { id },
      data,
    });
  }

  async findAll(
    params: PaginationDto<
      Prisma.CustomerWhereInput,
      Prisma.CustomerSelect,
      Prisma.CustomerInclude,
      Prisma.CustomerOrderByWithRelationInput
    >,
  ): Promise<GetCustomerDto[]> {
    const baseQuery: Prisma.CustomerFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    return await this.databaseService.customer.findMany({
      ...baseQuery,
      orderBy: { createdAt: "desc" },
    });
  }
}

export const customerService = new CustomerService();
