// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { SendPaginationDto } from "../../dto/pagination.dto";
import {
  ReceivedCheckDTO,
  SendCreateReceiveCheckDto,
  SendUpdateReceiveCheckDto,
} from "../../dto/receive-check.dto";
import { requestService } from "../requestService/requestService";

class ReceiveCheckService {
  private readonly url: string;

  constructor() {
    this.url = "/receive-check";
  }

  create(data: SendCreateReceiveCheckDto) {
    return requestService.post(this.url, data);
  }

  patch(data: SendUpdateReceiveCheckDto) {
    return requestService.patch(this.url, data);
  }

  findAll(data: SendPaginationDto) {
    return requestService.getAll<SendPaginationDto, ReceivedCheckDTO[]>(
      this.url,
      data,
    );
  }

  findByCheckNumber({ checkNumber }: Partial<SendUpdateReceiveCheckDto>) {
    return requestService.getByFilters<
      Partial<SendUpdateReceiveCheckDto>,
      ReceivedCheckDTO[]
    >(this.url, { checkNumber });
  }
}

export const receiveCheckService = new ReceiveCheckService();
