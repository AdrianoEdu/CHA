// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { JSX, useEffect, useState } from "react";
import Input, { InputType } from "../../input/page";
import Button, { ButtonStatusEnum } from "../../button/page";
import {
  UpdateReceivedCheckDTO,
  UpsertReceivedCheckDto,
} from "@/app/web/dto/receive-check.dto";
import { bankService } from "@/app/web/services/bankService/bankService";
import { customerService } from "@/app/web/services/customerService/customerService";
import ComboBox from "../../combobox/page";
import { ActionEnum, ReceivedCheckStatus } from "@/app/web/constants/enum";
import {
  getListStatusReceiveCheck,
  sortStringNumbers,
} from "@/app/web/utils/conversionList";

interface ReceivedCheckModalProps {
  isEdit?: boolean;
  onClose: () => void;
  editData?: UpdateReceivedCheckDTO;
  onSubmit: (data: UpsertReceivedCheckDto, isEdit?: boolean) => void;
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

export default function UpsertReceivedCheckModal({
  editData,
  onClose,
  onSubmit,
  isEdit = false,
}: ReceivedCheckModalProps): JSX.Element {
  const [data, setData] = useState<UpsertReceivedCheckDto>({
    id: "",
    bankId: "",
    agency: "",
    customerId: "",
    totalAmount: 0,
    checkNumber: "0",
    currentAmount: 0,
    goodForAt: new Date(),
  });

  const [date, setDate] = useState("");
  const [listBank, setListBank] = useState<SelectOption[]>([]);
  const [statusList, setStatusList] = useState<SelectOption[]>([]);
  const [customerList, setCustomerList] = useState<SelectOption[]>([]);

  const [bankOption, setBankOption] = useState<SelectOption>({
    id: "",
    name: "",
    list: [],
  });

  const [customerOption, setCustomerOption] = useState<SelectOption>({
    id: "",
    name: "",
  });

  const [agencieOption, setAgencieOption] = useState<SelectOption>({
    id: "",
    name: "",
  });

  const [statusOption, setStatusOption] = useState<SelectOption>({
    id: "",
    name: "",
  });

  useEffect(() => {
    handleFetchAllData();
  }, []);

  const handleFetchAllData = async (): Promise<void> => {
    try {
      const [banks, customers] = await Promise.all([
        bankService.findAll().then((list) =>
          list.map((bank) => ({
            id: bank.id,
            name: bank.name,
            list: sortStringNumbers(bank.agencies),
          })),
        ),
        customerService
          .findAll({ type: ActionEnum.FindAll })
          .then((list) => list.map((c) => ({ id: c.id, name: c.name }))),
      ]);

      setListBank(banks);
      setCustomerList(customers);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  useEffect(() => {
    if (!editData || listBank.length === 0) return;

    const statusList = getListStatusReceiveCheck();
    setStatusList(statusList);

    const currentStatus = statusList
      .filter((status) => status.id === editData.status)
      .at(0);

    setStatusOption(currentStatus!);

    const bank = listBank.find((b) => b.id === editData.bankId);

    const customer = customerList.find((c) => c.id === editData.customerId);

    setData((prev) => ({
      ...prev,
      ...editData,
    }));

    if (bank) {
      setBankOption(bank);

      const agency = bank.list?.find((a) => a === editData.agency);

      if (agency) {
        setAgencieOption({
          id: agency,
          name: agency,
        });
      }
    }

    if (customer) {
      setCustomerOption(customer);
    }

    if (editData.goodForAt) {
      const formatted = new Date(editData.goodForAt)
        .toISOString()
        .split("T")[0];

      setDate(formatted);
    }
  }, [editData, listBank, customerList]);

  const handleSelectBankOption = (option: SelectOption) => {
    setBankOption(option);

    setData((prev) => ({
      ...prev,
      bankId: option.id,
      agency: "",
    }));

    setAgencieOption({ id: "", name: "" });
  };

  const handleSelectStatusOption = (option: SelectOption): void => {
    setStatusOption(option);

    setData((prev) => ({
      ...prev,
      status: option.id as ReceivedCheckStatus,
    }));
  };

  const handleSelectCustomerOption = (option: SelectOption): void => {
    setCustomerOption(option);

    setData((prev) => ({
      ...prev,
      customerId: option.id,
    }));
  };

  const handleSelectAgencieOption = (option: SelectOption) => {
    setAgencieOption(option);

    setData((prev) => ({
      ...prev,
      agency: option.name,
    }));
  };

  const handleSubmit = (): void => {
    alert(JSON.stringify(data));

    isEdit
      ? onSubmit({ ...data, id: editData?.id ?? "" }, isEdit)
      : onSubmit({ ...data });
  };

  return (
    <div className="flex flex-col p-6 space-y-2 gap-4">
      <h2 className="text-lg font-semibold">
        {isEdit
          ? "Editar Recebimento de cheque"
          : "Registrar recebimento de cheque"}
      </h2>

      <ComboBox
        valueKey="id"
        labelKey="name"
        disabled={isEdit}
        options={customerList}
        selected={customerOption}
        label="Selecione o cliente"
        onSelectOption={handleSelectCustomerOption}
      />

      <ComboBox
        valueKey="id"
        labelKey="name"
        disabled={isEdit}
        options={listBank}
        selected={bankOption}
        label="Selecione a instituição financeira"
        onSelectOption={handleSelectBankOption}
      />

      {(bankOption.list ?? []).length > 0 && (
        <ComboBox
          valueKey="id"
          labelKey="name"
          options={(bankOption.list ?? []).map((a) => ({
            id: a,
            name: a,
          }))}
          selected={agencieOption}
          label="Selecione número da agência bancaria"
          onSelectOption={handleSelectAgencieOption}
        />
      )}

      <Input
        value={data.checkNumber}
        inputType={InputType.Number}
        name="Informe numero do cheque"
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            checkNumber: e.target.value,
          }))
        }
      />

      <Input
        disabled={isEdit}
        value={data.totalAmount}
        inputType={InputType.Money}
        name="Informe o valor do cheque"
        onChange={(e) => {
          setData((prev) => ({
            ...prev,
            totalAmount: parseMoneyToNumber(e.target.value),
          }));
        }}
      />

      <Input
        inputType={InputType.Date}
        name="Data"
        value={date}
        onChange={(e) => {
          const value = e.target.value;
          setDate(value);

          setData((prev) => ({
            ...prev,
            goodForAt: new Date(value),
          }));
        }}
      />

      {isEdit && (
        <ComboBox
          valueKey="id"
          labelKey="name"
          options={statusList}
          selected={statusOption}
          label="Selecione o estado atual do cheque"
          onSelectOption={handleSelectStatusOption}
        />
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          className="px-4 py-2"
          onClick={handleSubmit}
          text={isEdit ? "Atualizar" : "Criar"}
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
