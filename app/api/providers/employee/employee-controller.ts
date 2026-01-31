// Copyright (c) 2026-01-31
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { employeeService } from "./employee-service";

export class EmployeeController {
  private employeeService;

  constructor() {
    this.employeeService = employeeService;
  }

  async create(decryptedBody: any) {
    try {
      const employee = await this.employeeService.create(decryptedBody);
      return Response.json(employee, { status: 201 });
    } catch (error: any) {
      console.error('Erro ao criar Employee:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async update(id: string, decryptedBody: any) {
    try {
      await this.employeeService.update(id, decryptedBody);
      return Response.json({ message: 'Employee atualizado com sucesso' }, { status: 200 });
    } catch (error: any) {
      console.error('Erro ao atualizar Employee:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  async findAll() {
    try {
      const employees = await this.employeeService.findAll();
      return Response.json(employees, { status: 200 });
    } catch (error: any) {
      console.error('Erro ao buscar Employees:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}
