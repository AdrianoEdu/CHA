// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export enum ActionEnum {
  Login,
  IsLogged,
  Logout,
}

export interface ActionDto {
  type: ActionEnum;
}

export interface LoginDto extends ActionDto {
  login: string;
  password: string;
}

export interface AuthDto {
  name: string;
  lastName: string;
}
