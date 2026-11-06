// Copyright (c) 2026-11-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateEmployeeVacation,
  GetEmployeeVacation,
  PeriodEmployeeVacation,
  UpdateEmplyeeVacation,
} from "../../dto/EmployeeVacation/EmployeeVacation";
import { NotFoundException } from "../../error/NotFoundException";
import { databaseService } from "../../providers/database/DatabaseService";

class EmployeeVacationService {
  private databaseService = databaseService;

  private serializePeriods(periods: PeriodEmployeeVacation[]) {
    return periods.map((period) => ({
      begin: new Date(period.begin).toISOString(),
      end: new Date(period.end).toISOString(),
    }));
  }

  private deserializePeriods(periods: unknown): PeriodEmployeeVacation[] {
    if (!Array.isArray(periods)) return [];

    return periods.map((item) => {
      const period = item as {
        begin: string | Date;
        end: string | Date;
      };

      return {
        begin: new Date(period.begin),
        end: new Date(period.end),
      };
    });
  }

  async update(data: UpdateEmplyeeVacation) {
    const { id, periods, ...updateData } = data;

    const result = await this.databaseService.employeeVacation.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException("Employee vacation not found");
    }

    return this.databaseService.employeeVacation.update({
      where: { id },
      data: {
        ...updateData,
        ...(periods !== undefined
          ? {
              periods: this.serializePeriods(periods) as never,
            }
          : {}),
      },
    });
  }

  async addPeriod(id: string, period: PeriodEmployeeVacation) {
    const result = await this.databaseService.employeeVacation.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException("Employee vacation not found");
    }

    const currentPeriods = this.deserializePeriods(result.periods);

    const updatedPeriods = [
      ...currentPeriods,
      {
        begin: new Date(period.begin),
        end: new Date(period.end),
      },
    ];

    return this.update({
      id,
      periods: updatedPeriods,
    });
  }

  async create(data: CreateEmployeeVacation) {
    return this.databaseService.employeeVacation.create({
      data,
    });
  }

  async get(id: string): Promise<GetEmployeeVacation> {
    const result = await this.databaseService.employeeVacation.findFirst({
      where: { employeeId: id },
    });

    if (!result) {
      throw new NotFoundException("Employee vacation not found");
    }

    return {
      ...result,
      remainingDays: result.remainingDays ?? 0,
      periods: this.deserializePeriods(result.periods),
    };
  }
}

export const employeeVacationService = new EmployeeVacationService();
