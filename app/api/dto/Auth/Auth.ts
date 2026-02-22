// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export enum ActionEnum {
  Login,
  IsLogged,
  Logout,
}

export interface LoginDto {
  login: string;
  password: string;
}

export interface AuthLoggedDto {
  name: string;
  lastName: string;
}

export interface AuthDto extends AuthLoggedDto {
  token: string;
}
