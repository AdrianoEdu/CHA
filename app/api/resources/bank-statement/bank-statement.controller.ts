// Copyright (c) 2026-07-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateBankStatementDto,
  UpdateBankStatementDto,
} from "../../dto/BankStatement/BankStatement";
import { bankStatementService } from "./bank-statement.service";

class BankStatementController {
  private readonly bankStatementService;

  constructor() {
    this.bankStatementService = bankStatementService;
  }

  async create(data: CreateBankStatementDto) {
    return this.bankStatementService.create(data);
  }

  async update(data: UpdateBankStatementDto) {
    return this.bankStatementService.update(data);
  }
}

export const bankStatementConttroller = new BankStatementController();
