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

interface ReceivedCheckModalProps {
  data?: UpdateReceivedCheckDTO;
  onClose: () => void;
  onEdit: (data: UpdateReceivedCheckDTO) => void;
  onRegister: (data: CreateReceivedCheckDTO) => void;
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

let loading = true;

export default function UpsertReceivedCheckModal({
  data,
  onEdit,
  onClose,
  onRegister,
}: ReceivedCheckModalProps): JSX.Element {
  const isEdit = !data;

  const [showCalendar, setShowCalendar] = useState(false);

  const [selectBank, setSelectedBank] = useState<SelectOption | null>(null);
  const [selectAgency, setSelectedAgency] = useState<SelectOption | null>(null);
  const [selectCustomer, setSelectedCustomer] = useState<SelectOption | null>(
    null,
  );

  const [bankOptions, setBankOptions] = useState<SelectOption[]>([]);
  const [agencyOptions, setAgencyOptions] = useState<SelectOption[]>([]);
  const [customerOptions, setCustomerOptions] = useState<SelectOption[]>([]);
  const [receivedCheck, setReveivedCheck] = useState<UpdateReceivedCheckDTO>({
    id: "",
    notes: "",
    amount: 0,
    agency: "",
    bankId: "",
    checkNumber: 0,
    customerId: "",
    paidAt: new Date(),
    goodForAt: new Date(),
  });

  useEffect(() => {
    handleGetAllBanks();
    handleGetAllCustomers();

    if (data) setReveivedCheck(data);

    loading = false;

    return () => {
      loading = true;
    };
  }, []);

  const handleSetReceivedCheck = (
    data: Partial<UpdateReceivedCheckDTO>,
  ): void => {
    setReveivedCheck((prev) => ({ ...prev, ...data }));
  };

  const handleSetCheckNumber = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const checkNumber = Number(e.target.value);

    handleSetReceivedCheck({ checkNumber });
  };

  const handlerSetGoodForAt = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const goodForAt = new Date(e.target.value);

    handleSetReceivedCheck({ goodForAt });
  };

  const handlerSetAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const amount = Number(parseMoneyToNumber(e.target.value));

    handleSetReceivedCheck({ amount });
  };

  const handlerSetNotes = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    handleSetReceivedCheck({ notes: e.target.value });
  };

  const handleSetBankWithAgencies = (item: SelectOption | null): void => {
    setSelectedBank(item);

    if (item?.list) setSelectedAgency(null);

    const agenciesOptions = item?.list?.map((agency) => {
      return { id: agency, name: agency };
    });

    setAgencyOptions(agenciesOptions!);
  };

  const handleGetAllCustomers = async (): Promise<void> => {
    const { customers } = await customerService.findAll();

    const optionsCustomers = customers.map(({ id, name }) => {
      return { id, name };
    });

    setCustomerOptions(optionsCustomers);

    if (data?.customerId) {
      const [firstItem] = optionsCustomers.filter(
        ({ id }) => id === data.customerId,
      );

      setSelectedCustomer(firstItem);
    }
  };

  const handleGetAllBanks = async (): Promise<void> => {
    const { banks } = await bankService.findAll();

    const optionsBanks = banks.map(({ id, name, agencies }) => {
      return { id, name, list: agencies };
    });

    setBankOptions(optionsBanks);

    if (data?.bankId) {
      const [firstItem] = optionsBanks.filter(({ id }) => id === data.bankId);

      setSelectedBank({
        id: firstItem.id,
        name: firstItem.name,
        list: firstItem.list,
      });
    }
  };

  const handleUpsertReceivedCheck = (): void => {
    const { id, ...data } = receivedCheck;

    if (isEdit) {
      onEdit({ id, ...data });
      return;
    }

    onRegister({
      agency: selectAgency?.id,
      notes: receivedCheck.notes,
      bankId: selectBank?.id ?? "",
      amount: receivedCheck.amount,
      goodForAt: receivedCheck.goodForAt,
      customerId: selectCustomer?.id ?? "",
      checkNumber: receivedCheck.checkNumber ?? 0,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col p-6 space-y-2 gap-4 ${showCalendar ? "min-h-175" : ""}`}
    >
      <h2 className="text-lg font-semibold">
        {isEdit ? "Atualizar cheque recebido" : "Registrar cheque recebido"}
      </h2>

      <ComboBox
        valueKey={"id"}
        labelKey={"name"}
        disabled={isEdit}
        selected={selectCustomer}
        options={customerOptions}
        onSelectOption={setSelectedCustomer}
        placeholder={"Selecione o cliente..."}
      />

      <ComboBox
        valueKey={"id"}
        labelKey={"name"}
        disabled={isEdit}
        options={bankOptions}
        selected={selectBank}
        placeholder="Selecione o banco..."
        onSelectOption={handleSetBankWithAgencies}
      />

      {selectBank?.list?.length && (
        <ComboBox
          valueKey={"id"}
          labelKey={"name"}
          disabled={isEdit}
          selected={selectAgency}
          options={agencyOptions}
          onSelectOption={setSelectedAgency}
          placeholder="Selecione a agência..."
        />
      )}

      <Input
        type="number"
        className="flex-1"
        inputType={InputType.Number}
        onChange={handleSetCheckNumber}
        value={receivedCheck?.checkNumber}
        name={"Insira o número do cheque"}
      />

      <Input
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        onChange={handlerSetGoodForAt}
        value={receivedCheck.goodForAt}
        name={"Selecione a data do bom para"}
        onCalendarVisibilityChange={setShowCalendar}
      />

      <Input
        className="flex-1"
        inputType={InputType.Money}
        showCalendar={showCalendar}
        onChange={handlerSetAmount}
        value={receivedCheck.amount}
        name={"Insira o valor do cheque"}
        onCalendarVisibilityChange={setShowCalendar}
      />

      <Input
        className="flex-1"
        onChange={handlerSetNotes}
        value={receivedCheck.notes}
        name={"Anotação de recebimento de cheque"}
        inputType={InputType.Annotation}
      />

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
