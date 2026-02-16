// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { obfuscateKey } from "../utils/obfuscate";

export const appConfig = {
  KEY: obfuscateKey(
    "7cc9cb4351349cc456a2cbef9a58c2d586cc41acc77ab122e77e317e7ea3e222",
  ),
  API: obfuscateKey("http://localhost:3000/api"),
};
