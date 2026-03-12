// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { UserRole } from "@/app/generated/prisma";

export enum ActionEnum {
  Login,
  Logout,
  IsLogged,

  FindAll,
  FindByName,
}

export interface LoginDto {
  login: string;
  password: string;
}

export interface AuthLoggedDto {
  name: string;
  role?: UserRole;
  lastName: string;
}

export interface AuthDto extends AuthLoggedDto {
  token: string;
}
