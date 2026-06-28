// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateCurrentAccountDto,
  CurrentAccountParams,
  GetCurrentAccountParamsDto,
  UpdateCurrentAccountDto,
} from "../../dto/current-accont.dto";
import { requestService } from "../requestService/requestService";

class CurrentAccountService {
  private readonly url: string;

  constructor() {
    this.url = "/current-account";
  }

  create(data: CreateCurrentAccountDto) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateCurrentAccountDto) {
    return requestService.update<UpdateCurrentAccountDto, void>(this.url, data);
  }

  findAll(data: CurrentAccountParams) {
    return requestService.getAll<
      CurrentAccountParams,
      GetCurrentAccountParamsDto
    >(this.url, data);
  }
}

export const currentAccountService = new CurrentAccountService();
