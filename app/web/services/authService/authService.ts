// Copyright (c) 2026-02-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionDto, AuthDto, LoginDto } from "../../dto/auth.dto";
import { requestService } from "../requestService/requestService";

class AuthService {
  private readonly url: string;

  constructor() {
    this.url = "/auth";
  }

  login(data: LoginDto) {
    return requestService.post<LoginDto, { token: string }>(this.url, data);
  }

  isLogged(data: ActionDto) {
    return requestService.post<ActionDto, AuthDto>(this.url, data);
  }

  logout(data: ActionDto) {
    return requestService.post<ActionDto, void>(this.url, data);
  }
}

export const authService = new AuthService();
