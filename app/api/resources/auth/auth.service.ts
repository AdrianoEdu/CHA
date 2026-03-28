// Copyright (c) 2026-01-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { databaseService } from "../../providers/database/DatabaseService";
import * as argon2 from "argon2";
import { AuthDto, AuthLoggedDto, LoginDto } from "@/app/api/dto/Auth/Auth";
import jwt from "jsonwebtoken";
import { JwtProps } from "./types";
import { UnauthorizedException } from "../../error/UnauthorizedException";
import { ForbiddenException } from "../../error/ForbiddenExecption";

class AuthService {
  private databaseService = databaseService;
  private readonly JWT_SECRET = process.env.JWT_SECRET ?? "";

  async login({ login, password }: LoginDto): Promise<AuthDto> {
    const user = await databaseService.user.findUnique({ where: { login } });

    if (!user) throw new Error("Autenticação inválida");

    const passwordValid = await this.comparePassword(user.password, password);

    if (!passwordValid) throw new Error("Autenticação inválida");

    const token = this.generateJwt({
      sub: user.id,
      login: user.login,
      key: this.JWT_SECRET,
    });

    return { lastName: user.lastName, name: user.name, token, role: user.role };
  }

  private comparePassword(hash: string, passwd: string) {
    return argon2.verify(hash, passwd);
  }

  async isLogged(token: string): Promise<AuthLoggedDto> {
    if (!token) return { name: "", lastName: "", role: undefined };

    const userId = this.decodeJwt(token) ?? "";

    const user = await databaseService.user.findFirst({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    return {
      name: user?.name ?? "",
      lastName: user?.lastName ?? "",
      role: user.role,
    };
  }

  async logout(token: string): Promise<void> {
    if (!token) throw new ForbiddenException();

    const userId = this.decodeJwt(token) ?? "";

    const user = await databaseService.user.findFirst({
      where: { id: userId },
    });

    if (!user) throw new ForbiddenException("Falha ao executar o logout");
  }

  private generateJwt({ key, login, sub }: JwtProps) {
    return jwt.sign({ sub, login }, key, {
      expiresIn: "15m",
    });
  }

  private decodeJwt(token: string) {
    const decoded = jwt.verify(token, this.JWT_SECRET) as JwtProps;
    return decoded.sub;
  }
}

export const authService = new AuthService();
