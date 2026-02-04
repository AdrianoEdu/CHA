// Copyright (c) 2026-01-30
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { decrypt } from "../lib/decrypt";

export function decryptMiddleware<T>(payload: T) {
  const decrypted = decrypt(payload);
  return decrypted;
}