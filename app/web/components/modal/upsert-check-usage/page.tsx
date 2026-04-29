// Copyright (c) 2026-04-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { JSX, useEffect, useState } from "react";
import Input, { InputType } from "../../input/page";
import Button, { ButtonStatusEnum } from "../../button/page";
import ComboBox from "../../combobox/page";
import {
  CheckUsageDTO,
  UpsertCheckUsageDTO,
} from "@/app/web/dto/check-usage.dto";
import { CheckUsageType, TransactionStatus } from "@/app/web/constants/enum";
import { transactionService } from "@/app/web/services/transactionService/transactionService";
import { GetTrasnactionDTO } from "@/app/web/dto/transaction.dto";

interface CheckUsageModalProps {
  onClose: () => void;
  onSubmit: (data: UpsertCheckUsageDTO, isEdit?: boolean) => void;
  editData?: CheckUsageDTO;
  receivedCheckId: string;
}

type SelectOption = { id: string; name: string };

const statusMap: Record<CheckUsageType, string> = {
  DEPOSIT: "Depósito",
  PAYABLE: "Contas a pagar",
};

const mapperTransaction = (
  data: GetTrasnactionDTO | GetTrasnactionDTO[],
): SelectOption[] => {
  if (Array.isArray(data))
    return data.map((transaction) => ({
      id: transaction.id,
      name: transaction.category.name ?? "",
    }));

  return [{ id: data.id, name: data.category.name ?? "" }];
};

export function UpsertCheckUsageModal({
  onClose,
  onSubmit,
  editData,
  receivedCheckId,
}: CheckUsageModalProps): JSX.Element {
  const [data, setData] = useState<UpsertCheckUsageDTO>({
    id: "",
    notes: "",
    amount: 0,
    receivedCheckId,
    transactionId: "",
    usedAt: new Date(),
    usageType: CheckUsageType.DEPOSIT,
  });

  const [date, setDate] = useState("");
  const [usageTypeList, setUsageTypeList] = useState<SelectOption[]>([]);
  const [usageTypeOption, setUsageTypeOption] = useState<SelectOption | null>(
    null,
  );

  const [transactionOption, settransactionOption] = useState<SelectOption[]>(
    [],
  );
  const [transactionSelectOption, settransactionSelectOption] =
    useState<SelectOption | null>(null);

  useEffect(() => {
    const list: SelectOption[] = Object.values(CheckUsageType).map((value) => ({
      id: String(value),
      name: String(statusMap[value]),
    }));

    setUsageTypeList(list);

    handleGetTransactions();
  }, []);

  useEffect(() => {
    if (!editData) return;

    setData({
      ...editData,
      usedAt: editData.usedAt,
      transactionId: editData.transaction.id ?? "",
      receivedCheckId: editData.receivedCheck.id ?? "",
    });

    const currentType = usageTypeList.find(
      (t) => String(t.id) === String(editData.usageType),
    );

    setUsageTypeOption(currentType ?? null);

    if (editData.usedAt) {
      const formatted = new Date(editData.usedAt).toISOString().split("T")[0];

      setDate(formatted);
    }
  }, [editData, usageTypeList]);

  const handleGetTransactions = async (): Promise<void> => {
    const result = await transactionService.findAll({
      all: true,
      where: { status: { not: TransactionStatus.FINALIZED } },
    });

    settransactionOption(mapperTransaction(result));
  };

  const handleSelectUsageType = (option: SelectOption | null) => {
    setUsageTypeOption(option);

    setData((prev) => ({
      ...prev,
      usageType: option?.id as CheckUsageType,
    }));
  };

  const handleSelectTransaction = (option: SelectOption | null) => {
    settransactionSelectOption(option);

    setData((prev) => ({
      ...prev,
      transactionId: option?.id ?? "",
    }));
  };

  const handleSubmit = () => {
    onSubmit({ ...data, receivedCheckId }, !!editData);
  };

  return (
    <div className="flex flex-col p-6 space-y-2 gap-4">
      <h2 className="text-lg font-semibold">
        {!!editData ? "Editar uso do cheque" : "Registrar uso do cheque"}
      </h2>

      <Input
        inputType={InputType.Money}
        name="Valor utilizado"
        value={data.amount}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            amount: Number(
              e.target.value
                .replace(/\s/g, "")
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", "."),
            ),
          }))
        }
      />

      <Input
        inputType={InputType.Date}
        name="Data de uso"
        value={date}
        onChange={(e) => {
          const value = e.target.value;
          setDate(value);

          setData((prev) => ({
            ...prev,
            usedAt: new Date(value),
          }));
        }}
      />

      <ComboBox
        valueKey="id"
        labelKey="name"
        options={transactionOption}
        selected={transactionSelectOption}
        label="Tipo de uso"
        onSelectOption={handleSelectTransaction}
      />

      <ComboBox
        valueKey="id"
        labelKey="name"
        options={usageTypeList}
        selected={usageTypeOption}
        label="Tipo de uso"
        onSelectOption={handleSelectUsageType}
      />

      <Input
        name="Observação"
        inputType={InputType.Annotation}
        value={data.notes ?? ""}
        onValueChange={(value) =>
          setData((prev) => ({ ...prev, notes: value as string }))
        }
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          onClick={handleSubmit}
          text={editData ? "Atualizar" : "Registrar"}
          status={editData ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
