// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { decrypt } from "../lib/decrypt";

export function decryptMiddleware<T>(payload: T) {
  if (!payload) throw new Error('Payload ausente!');

  const decrypted = decrypt(payload);
  return decrypted;
}