// Copyright (c) 2026-01-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { EmployeeDto } from '@/app/dto/Employee/CreateEmployee';
import { databaseService } from '../providers/DatabaseService';
import { Employee } from '@/app/generated/prisma';

class EmployeeService {
  private databaseService = databaseService;

  async create(employee: EmployeeDto): Promise<Employee> {
    return this.databaseService.employee.create({ data: employee });
  }

  async update(id: string, data: Partial<EmployeeDto>): Promise<void> {
    await this.databaseService.employee.update({ where: { id }, data });
  }

  async findAll(): Promise<Employee[]> {
    return await this.databaseService.employee.findMany();
  }
}

export const employeeService = new EmployeeService();
