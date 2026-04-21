// Copyright (c) 2026-03-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Prisma } from "@/app/generated/prisma";
import { exployeeAdvancedService } from "./employee-advanced.service";
import { parsePrismaQuery } from "../../utils/parseFindParams";

export class EmployeeAdvanceController {
  private employeeAdvancedService;

  constructor() {
    this.employeeAdvancedService = exployeeAdvancedService;
  }

  async create(decryptedBody: any) {
    try {
      const employee = await this.employeeAdvancedService.create(decryptedBody);
      return Response.json(employee, { status: 201 });
    } catch (error: any) {
      console.error("Erro ao criar Employee Advance:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async update(id: string, decryptedBody: any) {
    try {
      await this.employeeAdvancedService.update(id, decryptedBody);
      return Response.json(
        { message: "Employee atualizado com sucesso" },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Erro ao atualizar Employee Advance:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findAll(req: Request) {
    try {
      const query = parsePrismaQuery<
        Prisma.EmployeeAdvanceWhereInput,
        Prisma.EmployeeAdvanceSelect,
        Prisma.EmployeeAdvanceInclude,
        Prisma.EmployeeAdvanceOrderByWithRelationInput
      >(req);

      return this.employeeAdvancedService.findCheckUsage(query);
    } catch (error: any) {
      console.error("Erro ao buscar Employee Advance:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findByName(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const reasonName = searchParams.get("reasonName") ?? "";

      return await this.employeeAdvancedService.findByName({ reasonName });
    } catch (error) {}
  }
}

export const employeeAdvanceController = new EmployeeAdvanceController();
