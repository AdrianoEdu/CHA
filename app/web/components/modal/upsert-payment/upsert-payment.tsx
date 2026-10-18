// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CreatePaymentDto, UpdatePaymentDto } from "@/app/web/dto/payment";
import React, { JSX } from "react";

interface PaymentModalProps {
  data?: UpdatePaymentDto;
  onClose: () => void;
  onEdit: (data: UpdatePaymentDto) => void;
  onRegister: (data: CreatePaymentDto) => void;
}

export default function UpsertPaymentModal({
  data,
  onEdit,
  onClose,
  onRegister,
}: PaymentModalProps): JSX.Element {
  return <div></div>;
}
