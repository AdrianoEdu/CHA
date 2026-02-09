// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { LoginDto } from "@/app/dto/Auth/Auth";
import { authService } from "./auth-service";

export class AuthController {
  private authService;

  constructor() {
    this.authService = authService;
  }

  async login({ login, password }: LoginDto): Promise<string> {
    return await authService.login({ login, password})
  }
}