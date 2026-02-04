// Copyright (c) 2026-02-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

export async function seedUsers(prisma: PrismaClient) {
  const passwordHash = await argon2.hash('admin123');

  await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      password: passwordHash,
      status: 'ACTIVE',
    },
  });

  console.log('👤 Usuários seedados');
}
