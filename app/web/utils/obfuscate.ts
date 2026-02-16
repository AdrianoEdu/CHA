// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export function obfuscateKey(key: string): string {
  let inverted = key.split("").reverse().join("");

  let obfuscated = "";
  for (let i = 0; i < inverted.length; i++) {
    obfuscated += inverted[i];
    if ((i + 1) % 4 === 0) obfuscated += "X";
  }

  return obfuscated;
}

export function deobfuscateKey(obf: string): string {
  let cleaned = obf.replace(/X/g, "");

  return cleaned.split("").reverse().join("");
}
