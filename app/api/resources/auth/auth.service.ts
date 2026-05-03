// Copyright (c) 2026-01-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { databaseService } from "../../providers/database/DatabaseService";
import bcrypt from "bcryptjs";
import { AuthDto, AuthLoggedDto, LoginDto } from "@/app/api/dto/Auth/Auth";
import jwt from "jsonwebtoken";
import { JwtProps } from "./types";
import { UnauthorizedException } from "../../error/UnauthorizedException";
import { ForbiddenException } from "../../error/ForbiddenExecption";

class AuthService {
  private databaseService = databaseService;
  private readonly JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

  async login({ login, password }: LoginDto): Promise<AuthDto> {
    const user = await this.databaseService.user.findUnique({
      where: { login },
    });

    if (!user) throw new UnauthorizedException("Autenticação inválida");

    const passwordValid = await this.comparePassword(password, user.password);

    if (!passwordValid)
      throw new UnauthorizedException("Autenticação inválida");

    const token = this.generateJwt({
      sub: user.id,
      login: user.login,
      key: this.JWT_SECRET,
    });

    return {
      lastName: user.lastName,
      name: user.name,
      token,
      role: user.role,
    };
  }

  private async comparePassword(passwd: string, hash: string) {
    return bcrypt.compare(passwd, hash);
  }

  async isLogged(token: string): Promise<AuthLoggedDto> {
    if (!token) return { name: "", lastName: "", role: undefined };

    let userId: string;

    try {
      userId = this.decodeJwt(token);
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    return {
      name: user.name ?? "",
      lastName: user.lastName ?? "",
      role: user.role,
    };
  }

  async logout(token: string): Promise<void> {
    if (!token) throw new ForbiddenException();

    try {
      this.decodeJwt(token);
    } catch {
      throw new ForbiddenException();
    }

    // opcional: implementar blacklist de token futuramente
  }

  private generateJwt({ key, login, sub }: JwtProps) {
    return jwt.sign({ sub, login }, key, {
      expiresIn: "15m",
    });
  }

  private decodeJwt(token: string): string {
    const decoded = jwt.verify(token, this.JWT_SECRET) as JwtProps;
    return decoded.sub;
  }
}

export const authService = new AuthService();
