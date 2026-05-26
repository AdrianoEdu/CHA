// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import {
  CreateCustomerDto,
  GetCustomerDtoParams,
  RemoverCustomerDto,
  UpdateCustomerDto,
} from "../../dto/Customer/Customer";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { HttpException } from "../../error/HttpException";
import { NotFoundException } from "../../error/NotFoundException";

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

  async findCustomer(
    params: PaginationDto<
      Prisma.CustomerWhereInput,
      Prisma.CustomerSelect,
      Prisma.CustomerInclude,
      Prisma.CustomerOrderByWithRelationInput
    >,
  ): Promise<GetCustomerDtoParams> {
    const baseQuery: Prisma.CustomerFindManyArgs = {
      skip: params.skip,
      where: params.where,
      take: params.take,
      orderBy: params.orderBy,
    };

    if (params.select) baseQuery.select = params.select;
    if (params.include) baseQuery.include = params.include;

    const count = await this.databaseService.customer.count();

    if (!params.all)
      return { count, customers: await this.findFirst(baseQuery) };

    return { count, customers: await this.findMany(baseQuery) };
  }

  async findMany(baseQuery: Prisma.CustomerFindManyArgs) {
    return this.databaseService.customer.findMany({
      ...baseQuery,
    });
  }

  async findFirst(baseQuery: Prisma.CustomerFindManyArgs) {
    const result = await this.databaseService.customer.findFirst({
      ...baseQuery,
    });

    if (!result) throw new NotFoundException();

    return [result];
  }

  async remove({ id }: RemoverCustomerDto) {
    const customer = await this.databaseService.customer.findFirst({
      where: { id },
    });

    if (!customer) throw new HttpException("Cliente não encontrado", 404);

    await this.databaseService.customer.update({
      where: { id: customer.id },
      data: { isActive: false },
    });
  }
}

export const customerService = new CustomerService();
