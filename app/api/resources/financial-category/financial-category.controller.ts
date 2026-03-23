// Copyright (c) 2026-03-21
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.

import {
  CreateFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "../../dto/FinancialCategory/FinancialCategory";
import { financialCategoryService } from "./financial-category.service";
import { RemoveAdvanceReason } from "../../dto/AdvanceReason/AdvanceReason";

class FinancialCategoryController {
  private financialCategoryService;

  constructor() {
    this.financialCategoryService = financialCategoryService;
  }

  async create(data: CreateFinancialCategoryDto) {
    return this.financialCategoryService.create(data);
  }

  async update(data: UpdateFinancialCategoryDto) {
    return this.financialCategoryService.update(data);
  }

  async findAll(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const skip = searchParams.get("skip");
      const take = searchParams.get("take");

      return this.financialCategoryService.findAll({
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

      return await this.financialCategoryService.findByName({ name });
    } catch (error) {}
  }

  async remove({ id }: RemoveAdvanceReason) {
    return await this.financialCategoryService.delete({ id });
  }
}

export const financialCategoryController = new FinancialCategoryController();
