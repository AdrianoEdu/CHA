// Copyright (c) 2026-01-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { databaseService } from '../../providers/database/DatabaseService';
import * as argon2 from 'argon2';
import { LoginDto } from '@/app/dto/Auth/Auth';
import jwt from 'jsonwebtoken';
import { JwtProps } from './types';


class AuthService {
  private databaseService = databaseService;
  private readonly SECRET_KEY = process.env.SECRET_KEY ?? '';

    async login({ login, password }: LoginDto): Promise<string> {
      const user = await databaseService.user.findUnique({where: { login }})
  
      if (!user) {
        throw new Error('Autenticação inválida 1°');
      }
  
      const passwordValid = await this.comparePassword(
        user.password,
        password,
      );
  
      if (!passwordValid ) {
        throw new Error('Autenticação inválida2°');
      }
  
      const token = this.generateJwt({
        sub: user.id,
        login: user.login,
        key: this.SECRET_KEY,
      });
  
      return token;
    }
  
    private comparePassword(hash: string, passwd: string) {
        return argon2.verify(hash, passwd);
    }
  
    private generateJwt({key, login, sub}: JwtProps) {
      return jwt.sign({ sub, login }, key , {
          expiresIn: '15m',
      });
    }
}

export const authService = new AuthService();
