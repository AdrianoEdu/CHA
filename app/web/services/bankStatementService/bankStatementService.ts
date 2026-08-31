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

  async create(data: CreateBankStatementDto) {
    const { file, ...payloadData } = data;

    const formData = new FormData();

    formData.append("payload", JSON.stringify(payloadData));

    if (file) {
      formData.append("file", file);
    }

    return requestService.post(this.url, formData);
  }

  async update(data: UpdateBankStatementDto) {
    return requestService.update<UpdateBankStatementDto, void>(this.url, data);
  }

  async findAll(data: BankStatementParams) {
    const result = await requestService.getAll<
      BankStatementParams,
      GetBankStatementParamsDto
    >(this.url, data);
    return result;
  }
}

export const bankStatementService = new BankStatementService();
