// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  BankStatementParams,
  CreateBankStatementDto,
  GetBankStatementParamsDto,
  UpdateBankStatementDto,
} from "../../dto/bank-statemenrt-dto";
import { requestService } from "../requestService/requestService";

class BankStatementService {
  private readonly url: string;

  constructor() {
    this.url = "/bank-statement";
  }

  create(data: CreateBankStatementDto) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateBankStatementDto) {
    return requestService.update<UpdateBankStatementDto, void>(this.url, data);
  }

  findAll(data: BankStatementParams) {
    return requestService.getAll<
      BankStatementParams,
      GetBankStatementParamsDto
    >(this.url, data);
  }
}

export const bankStatementService = new BankStatementService();
