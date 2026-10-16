// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export enum ActionEnum {
  Login,
  Logout,
  IsLogged,

  FindAll,
  FindByFilters,
}

export enum RegisterAction {
  General = "General",
  Bank = "Bank",
  Financial = "Financial",
  Costumer = "Costumer",
  Employee = "Employee",
}

export enum FinancialFlowType {
  IN = "IN",
  OUT = "OUT",
}

export enum ReceivedCheckStatus {
  RECEIVED = "RECEIVED",
  FINALIZED = "FINALIZED",
  CANCELLED = "CANCELLED",
}

export enum CheckUsageType {
  DEPOSIT = "DEPOSIT",
  PAYABLE = "PAYABLE",
}

export enum TransactionStatus {
  CREATED = "CREATED",
  IN_USE = "IN_USE",
  FINALIZED = "FINALIZED",
}

export enum AccountType {
  BANK = "BANK",
  CASHBOOK = "CASHBOOK",
}

export enum EmployeePositionEnum {
  TAX_DEPARTMENT_MANAGER = "TAX_DEPARTMENT_MANAGER",
  PERSONNEL_DEPARTMENT_MANAGER = "PERSONNEL_DEPARTMENT_MANAGER",
  MOTORBOY = "MOTORBOY",
  TAX_ASSISTANT_N5 = "TAX_ASSISTANT_N5",
  PERSONNEL_DEPARTMENT_ASSISTANT = "PERSONNEL_DEPARTMENT_ASSISTANT",
  TAX_ASSISTANT_N3 = "TAX_ASSISTANT_N3",
  TAX_ASSISTANT_N1 = "TAX_ASSISTANT_N1",
  OFFICE_ASSISTANT = "OFFICE_ASSISTANT",
  CLEANING_ASSISTANT = "CLEANING_ASSISTANT",
  ADMINISTRATIVE_ASSISTANT = "ADMINISTRATIVE_ASSISTANT",
  TAX_ASSISTANT_N6 = "TAX_ASSISTANT_N6",
  TAX_ASSISTANT_N4 = "TAX_ASSISTANT_N4",
  TAX_ASSISTANT_N2 = "TAX_ASSISTANT_N2",
}
