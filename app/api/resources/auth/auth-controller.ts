// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AuthDto, AuthLoggedDto, LoginDto } from "@/app/api/dto/Auth/Auth";
import { authService } from "./auth-service";

export class AuthController {
  private authService;

  constructor() {
    this.authService = authService;
  }

  async login({ login, password }: LoginDto): Promise<AuthDto> {
    return await authService.login({ login, password });
  }

  async isLogged(token: string): Promise<AuthLoggedDto> {
    return await authService.isLogged(token);
  }

  async logout(token: string): Promise<void> {
    return await authService.logout(token);
  }
}
