// Copyright (c) 2026-02-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { HttpException } from "./HttpException";

export class ForbiddenException extends HttpException {
  constructor(message = "Não autorizado") {
    super(message, 403);
  }
}
