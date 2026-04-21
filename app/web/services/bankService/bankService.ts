// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

// Copyright (c) 2026-02-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  BankParams,
  GetBankDto as CreateBankDto,
  UpdateBankDto,
} from "../../dto/bank.dto";
import { requestService } from "../requestService/requestService";

class BankService {
  private readonly url: string;

  constructor() {
    this.url = "/bank";
  }

  update(data: UpdateBankDto) {
    return requestService.update<UpdateBankDto, void>(this.url, data);
  }

  create(data: CreateBankDto) {
    return requestService.post<CreateBankDto, void>(this.url, data);
  }

  findAll(data?: BankParams) {
    return requestService.getAll<BankParams, CreateBankDto[]>(this.url, data);
  }

  remove(id: string) {
    return requestService.delete(this.url, id);
  }
}

export const bankService = new BankService();
