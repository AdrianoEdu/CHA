// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateReceivedCheckDTO,
  ReceivedCheckDTO,
  ReceivedCheckParams,
  UpdateReceivedCheckDTO,
} from "../../dto/receive-check.dto";
import { requestService } from "../requestService/requestService";

class ReceiveCheckService {
  private readonly url: string;

  constructor() {
    this.url = "/received-check";
  }

  create(data: CreateReceivedCheckDTO) {
    return requestService.post(this.url, data);
  }

  update(data: UpdateReceivedCheckDTO) {
    return requestService.update(this.url, data);
  }

  findAll(data: ReceivedCheckParams) {
    return requestService.getAll<
      ReceivedCheckParams,
      ReceivedCheckDTO | ReceivedCheckDTO[]
    >(this.url, data);
  }
}

export const receiveCheckService = new ReceiveCheckService();
