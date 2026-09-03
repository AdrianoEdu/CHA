// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CashBookParams,
  CreateCashBookDto,
  GetCashBookParamsDto,
  UpdateCashBookDto,
} from "../../dto/cash-book.dto";
import { requestService } from "../requestService/requestService";

class CashBookService {
  private readonly url: string;

  constructor() {
    this.url = "/cash-book";
  }

  async create(data: CreateCashBookDto) {
    const { file, ...payloadData } = data;

    const formData = new FormData();

    formData.append("payload", JSON.stringify(payloadData));

    if (file) {
      formData.append("file", file);
    }

    return requestService.post(this.url, formData);
  }

  async update(data: UpdateCashBookDto) {
    return requestService.update<UpdateCashBookDto, void>(this.url, data);
  }

  async findAll(data: CashBookParams) {
    const result = await requestService.getAll<
      CashBookParams,
      GetCashBookParamsDto
    >(this.url, data);
    return result;
  }
}

export const cashBookService = new CashBookService();
