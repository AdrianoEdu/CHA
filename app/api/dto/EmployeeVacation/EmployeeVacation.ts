// Copyright (c) 2026-11-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type CreateEmployeeVacation = {
  employeeId: string;
  acquisitionEnd: Date;
  acquisitionStart: Date;
  periods?: PeriodEmployeeVacation[];
};

export type UpdateEmplyeeVacation = Partial<CreateEmployeeVacation> & {
  id: string;
  remainingDays?: number;
  lastCalculationDate?: Date | null;
};

export type GetEmployeeVacation = CreateEmployeeVacation & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  remainingDays?: number;
  lastCalculationDate: Date | null;
};

export type PeriodEmployeeVacation = {
  end: Date;
  begin: Date;
};
