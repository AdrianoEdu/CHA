// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export enum ActionEnum {
  Login,
  Logout,
  IsLogged,

  FindAll,
  FindByName,
}

export enum CustomerType {
  CLIENT,
  SUPPLIER,
}

export enum RegisterAction {
  General = "General",
  Bank = "Bank",
  Financial = "Financial",
  Costumer = "Costumer",
  Employee = "Employee",
}
