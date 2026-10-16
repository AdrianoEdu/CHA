// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { ChangeEvent, JSX, useEffect, useState } from "react";
import Input, { InputType } from "../../input/input";
import Button, { ButtonStatusEnum } from "../../button/button";
import {
  CreateReceivedCheckDTO,
  UpdateReceivedCheckDTO,
} from "@/app/web/dto/receive-check.dto";
import { bankService } from "@/app/web/services/bankService/bankService";
import { customerService } from "@/app/web/services/customerService/customerService";
import ComboBox from "../../combobox/combobox";
import {
  CreateRecurringPaymentDto,
  UpdateRecurringPaymentDto,
} from "@/app/web/dto/recurring-payment";
import CheckBox from "../../checkbox/checkbox";

interface RecurringPaymentModalProps {
  data?: UpdateRecurringPaymentDto;
  onClose: () => void;
  onEdit: (data: UpdateRecurringPaymentDto) => void;
  onRegister: (data: CreateRecurringPaymentDto) => void;
}

type SelectOption = { id: string; name: string; list?: string[] };

function parseMoneyToNumber(value: string): number {
  if (!value) return 0;

  return Number(
    value
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim(),
  );
}

export default function UpsertRecurringPaymentkModal({
  data,
  onEdit,
  onClose,
  onRegister,
}: RecurringPaymentModalProps): JSX.Element {
  const isEdit = Boolean(data);

  const [showCalendar, setShowCalendar] = useState(false);

  const [recurringPayment, setRecurrinPayment] =
    useState<UpdateRecurringPaymentDto>({
      id: "",
      dueDay: 0,
      fixedAmount: 0,
      isFixedAmount: false,
      isMonthly: false,
      name: "",
    });

  useEffect(() => {
    if (data) setRecurrinPayment(data);
  }, []);

  const handleSetRecurringPayment = (
    data: Partial<UpdateRecurringPaymentDto>,
  ): void => {
    setRecurrinPayment((prev) => ({ ...prev, ...data }));
  };

  const handlerSetFixedAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const fixedAmount = Number(parseMoneyToNumber(e.target.value));

    handleSetRecurringPayment({ fixedAmount });
  };

  const handleSetName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const name = e.target.value;

    handleSetRecurringPayment({ name });
  };

  const handleSetDueDay = (value: any): void => {
    const dueDay = Number(value);

    handleSetRecurringPayment({ dueDay });
  };

  const handleSetIsMoth = (): void => {
    handleSetRecurringPayment({
      ...recurringPayment,
      isMonthly: !recurringPayment.isMonthly,
    });
  };

  const handleSetIsFixedAmount = (): void => {
    handleSetRecurringPayment({
      ...recurringPayment,
      isFixedAmount: !recurringPayment.isFixedAmount,
    });
  };

  const handleUpsertReceivedCheck = (): void => {
    const { id, ...data } = recurringPayment;

    if (isEdit) {
      onEdit({ id, ...data });
      return;
    }

    onRegister({
      name: recurringPayment.name ?? "",
      dueDay: recurringPayment.dueDay ?? 0,
      isMonthly: recurringPayment.isMonthly ?? false,
      fixedAmount: recurringPayment.fixedAmount ?? 0,
      isFixedAmount: recurringPayment.isFixedAmount ?? false,
    });
  };

  return (
    <div
      className={`flex flex-col p-6 space-y-2 gap-4 ${showCalendar ? "min-h-175" : ""}`}
    >
      <h2 className="text-lg font-semibold">
        {isEdit ? "Atualizar cheque recebido" : "Registrar cheque recebido"}
      </h2>

      <Input
        className="flex-1"
        onChange={handleSetName}
        inputType={InputType.Text}
        value={recurringPayment.name}
        name={"Anotação de recebimento de cheque"}
      />

      <Input
        onlyDay
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        value={recurringPayment.dueDay}
        onValueChange={handleSetDueDay}
        name={"Selecione a data do bom para"}
        onCalendarVisibilityChange={setShowCalendar}
      />

      <div className="flex flex-row gap-10">
        <CheckBox
          text="Pagamento mensal?"
          onPress={handleSetIsMoth}
          status={recurringPayment.isMonthly ?? false}
        />

        <CheckBox
          text="Valor Fixo"
          onPress={handleSetIsFixedAmount}
          status={recurringPayment.isFixedAmount ?? false}
        />
      </div>

      {recurringPayment.isFixedAmount && (
        <Input
          type="number"
          className="flex-1"
          name={"Insira o valor"}
          inputType={InputType.Number}
          onChange={handlerSetFixedAmount}
          value={recurringPayment?.fixedAmount}
        />
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          className={"px-4 py-2"}
          onClick={handleUpsertReceivedCheck}
          text={isEdit ? "Atualizar" : "Confirmar"}
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
