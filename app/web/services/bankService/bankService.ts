// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

// Copyright (c) 2026-02-09
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { request } from "http";
import { ActionDto, AuthDto, LoginDto } from "../../dto/auth.dto";
import { BankDto } from "../../dto/bank.dto";
import { requestService } from "../requestService/requestService";
import { SendPaginationDto } from "../../dto/pagination.dto";

class BankService {
  private readonly url: string;

  constructor() {
    this.url = "/bank";
  }

  update(data: BankDto) {
    return requestService.update<BankDto, void>(this.url, data);
  }

  create(data: BankDto) {
    return requestService.post<BankDto, void>(this.url, data);
  }

  findAll(data: SendPaginationDto) {
    return requestService.getAll<SendPaginationDto, BankDto[]>(this.url, data);
  }
}

export const bankService = new BankService();
