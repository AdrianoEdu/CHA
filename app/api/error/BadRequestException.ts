// Copyright (c) 2026-11-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { HttpException } from "./HttpException";

export class BadRequestException extends HttpException {
  constructor(message = "Requisição inválida") {
    super(message, 400);
  }
}
