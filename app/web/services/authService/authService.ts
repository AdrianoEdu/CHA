// Copyright (c) 2026-02-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { requestService } from "../requestService/requestService";
import { LoginDto } from "@/app/dto/Auth/Auth";

class AuthService {
  private readonly url: string;

  constructor() {
    this.url = "/auth";
  }

  login(data: LoginDto) {
    return requestService.post<LoginDto, { token: string }>(this.url, data);
  }
}

export const authService = new AuthService();
