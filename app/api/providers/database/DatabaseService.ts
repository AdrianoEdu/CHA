// services/DatabaseService.ts
// Creation Date: 2026-01-20
// Author: Adriano Eduardo Trentin Júnior
// Copyright © 2026 VWTB
// All rights reserved.

import { PrismaClient } from "@/app/generated/prisma";

class DatabaseService extends PrismaClient {
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      DatabaseService.instance.init().catch(err => {
        console.error('Erro ao conectar no DB:', err);
      });
    }
    return DatabaseService.instance;
  }

   async init() {
    await this.$connect();
    console.log('Connected to database');
  }

  async disconnect() {
    await this.$disconnect();
    console.log('Disconnected from database');
  }
}

export const databaseService = DatabaseService.getInstance();
