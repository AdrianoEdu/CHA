// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateAccountDto,
  AccountParams,
  GetAccountParamsDto,
  UpdateAccountDto,
} from "../../dto/account.dto";
import { requestService } from "../requestService/requestService";

class AccountService {
  private readonly url: string;

  constructor() {
    this.url = "/account";
  }

  create(data: CreateAccountDto) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateAccountDto) {
    return requestService.update<UpdateAccountDto, void>(this.url, data);
  }

  findAll(data: AccountParams) {
    return requestService.getAll<AccountParams, GetAccountParamsDto>(
      this.url,
      data,
    );
  }
}

export const accountService = new AccountService();
