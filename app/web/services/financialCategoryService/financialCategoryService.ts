// Copyright (c) 2026-03-20
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateFinancialCategoryDto,
  GetFinancialCategoryDto,
  SendFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "../../dto/financial.dto";
import { SendPaginationDto } from "../../dto/pagination.dto";
import { requestService } from "../requestService/requestService";

class FinancialCategoryService {
  private readonly url: string;

  constructor() {
    this.url = "/financial-category";
  }

  update(data: UpdateFinancialCategoryDto) {
    return requestService.update<UpdateFinancialCategoryDto, void>(
      this.url,
      data,
    );
  }

  create(data: CreateFinancialCategoryDto) {
    return requestService.post<CreateFinancialCategoryDto, void>(
      this.url,
      data,
    );
  }

  findAll(data: SendPaginationDto) {
    return requestService.getAll<SendPaginationDto, GetFinancialCategoryDto[]>(
      this.url,
      data,
    );
  }

  findByName({ name }: Partial<SendFinancialCategoryDto>) {
    return requestService.getByFilters<
      Partial<SendFinancialCategoryDto>,
      GetFinancialCategoryDto[]
    >(this.url, { name });
  }
}

export const financialCategoryService = new FinancialCategoryService();
