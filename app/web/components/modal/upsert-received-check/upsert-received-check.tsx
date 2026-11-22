
 // Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, JSX } from "react";
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

type SelectOption = {
  id: string;
  name: string;
  list?: string[];
};

type ReceivedCheckForm = {
  id?: string;
  notes: string;
  amount: number;
  agency?: string;
  bankId?: string;
  checkNumber: number;
  customerId?: string;
  paidAt?: Date;
  goodForAt: Date;
};

function parseMoneyToNumber(value: string): number {
  if (!value.trim()) return 0;

  const normalizedValue = value
    .replace(/\s/g, "")
    .replace(/R\$/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const amount = Number(normalizedValue);

  return Number.isFinite(amount) ? amount : 0;
}

export default function UpsertReceivedCheckModal({
  data,
  onEdit,
  onClose,
  onRegister,
}: Readonly<ReceivedCheckModalProps>): JSX.Element {
  const isEdit = Boolean(data);

  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const [selectBank, setSelectedBank] = useState<SelectOption | undefined>(
    undefined,
  );
  const [selectAgency, setSelectedAgency] = useState<SelectOption | undefined>(
    undefined,
  );
  const [selectCustomer, setSelectedCustomer] = useState<
    SelectOption | undefined
  >(undefined);

  const [bankOptions, setBankOptions] = useState<SelectOption[]>([]);
  const [agencyOptions, setAgencyOptions] = useState<SelectOption[]>([]);
  const [customerOptions, setCustomerOptions] = useState<SelectOption[]>([]);

  const [receivedCheck, setReceivedCheck] = useState<ReceivedCheckForm>({
    id: data?.id,
    notes: data?.notes ?? "",
    amount: data?.amount ?? 0,
    agency: data?.agency,
    bankId: data?.bankId,
    checkNumber: data?.checkNumber ?? 0,
    customerId: data?.customerId,
    paidAt: data?.paidAt,
    goodForAt: data?.goodForAt ?? new Date(),
  });

  const handleGetAllCustomers = useCallback(async (): Promise<void> => {
    const { customers } = await customerService.findAll({
      orderBy: { name: "asc" },
    });

    const optionsCustomers = customers.map(({ id, name }) => ({
      id,
      name,
    }));

    setCustomerOptions(optionsCustomers);

    const selectedCustomer = optionsCustomers.find(
      ({ id }) => id === data?.customerId,
    );

    setSelectedCustomer(selectedCustomer);
  }, [data?.customerId]);

  const handleGetAllBanks = useCallback(async (): Promise<void> => {
    const { banks } = await bankService.findAll({
      orderBy: { name: "asc" },
    });

    const optionsBanks = banks.map(({ id, name, agencies }) => ({
      id,
      name,
      list: agencies ?? [],
    }));

    setBankOptions(optionsBanks);

    const selectedBank = optionsBanks.find(
      ({ id }) => id === data?.bankId,
    );

    setSelectedBank(selectedBank);

    const optionsAgencies = (selectedBank?.list ?? []).map((agency) => ({
      id: agency,
      name: agency,
    }));

    setAgencyOptions(optionsAgencies);

    const selectedAgency = optionsAgencies.find(
      ({ id }) => id === data?.agency,
    );

    setSelectedAgency(
      selectedAgency ??
        (data?.agency
          ? { id: data.agency, name: data.agency }
          : undefined),
    );
  }, [data?.agency, data?.bankId]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async (): Promise<void> => {
      setLoading(true);

      try {
        await Promise.all([
          handleGetAllBanks(),
          handleGetAllCustomers(),
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados do cheque recebido:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [handleGetAllBanks, handleGetAllCustomers]);

  const handleSetReceivedCheck = (
    value: Partial<ReceivedCheckForm>,
  ): void => {
    setReceivedCheck((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const handleSetCheckNumber = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    const checkNumber = value.trim() ? Number(value) : 0;

    handleSetReceivedCheck({
      checkNumber: Number.isFinite(checkNumber) ? checkNumber : 0,
    });
  };

  const handleSetGoodForAt = (value: Date | string | number): void => {
    if (!value) return;

    const goodForAt = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(goodForAt.getTime())) return;

    handleSetReceivedCheck({ goodForAt });
  };

  const handleSetAmount = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    handleSetReceivedCheck({
      amount: parseMoneyToNumber(event.target.value),
    });
  };

  const handleSetNotes = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    handleSetReceivedCheck({
      notes: event.target.value,
    });
  };

  const handleSetBankWithAgencies = (item?: SelectOption): void => {
    setSelectedBank(item);
    setSelectedAgency(undefined);

    const optionsAgencies = (item?.list ?? []).map((agency) => ({
      id: agency,
      name: agency,
    }));

    setAgencyOptions(optionsAgencies);

    handleSetReceivedCheck({
      bankId: item?.id,
      agency: undefined,
    });
  };

  const handleSelectAgency = (option?: SelectOption): void => {
    setSelectedAgency(option);
    handleSetReceivedCheck({
      agency: option?.id,
    });
  };

  const handleSelectCustomer = (option?: SelectOption): void => {
    setSelectedCustomer(option);
    handleSetReceivedCheck({
      customerId: option?.id,
    });
  };

  const handleUpsertReceivedCheck = (): void => {
    if (
      !receivedCheck.bankId ||
      !receivedCheck.customerId ||
      !receivedCheck.goodForAt ||
      receivedCheck.amount <= 0
    ) {
      return;
    }

    if (isEdit && receivedCheck.id) {
      onEdit({
        ...receivedCheck,
        id: receivedCheck.id,
        bankId: receivedCheck.bankId,
        customerId: receivedCheck.customerId,
      });

      return;
    }

    onRegister({
      agency: receivedCheck.agency,
      notes: receivedCheck.notes,
      bankId: receivedCheck.bankId,
      amount: receivedCheck.amount,
      goodForAt: receivedCheck.goodForAt,
      customerId: receivedCheck.customerId,
      checkNumber: receivedCheck.checkNumber,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col p-6 space-y-2 gap-4 ${
        showCalendar ? "min-h-175" : ""
      }`}
    >
      <h2 className="text-lg font-semibold">
        {isEdit ? "Atualizar cheque recebido" : "Registrar cheque recebido"}
      </h2>

      <ComboBox<SelectOption>
        valueKey="id"
        labelKey="name"
        selected={selectCustomer}
        options={customerOptions}
        onSelectOption={handleSelectCustomer}
        placeholder="Selecione o cliente..."
      />

      <ComboBox<SelectOption>
        valueKey="id"
        labelKey="name"
        options={bankOptions}
        selected={selectBank}
        placeholder="Selecione o banco..."
        onSelectOption={handleSetBankWithAgencies}
      />

      {agencyOptions.length > 0 && (
        <ComboBox<SelectOption>
          valueKey="id"
          labelKey="name"
          selected={selectAgency}
          options={agencyOptions}
          onSelectOption={handleSelectAgency}
          placeholder="Selecione a agência..."
        />
      )}

      <Input
        type="number"
        className="flex-1"
        inputType={InputType.Number}
        onChange={handleSetCheckNumber}
        value={receivedCheck.checkNumber}
        name="Insira o número do cheque"
      />

      <Input
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        value={receivedCheck.goodForAt}
        onValueChange={handleSetGoodForAt}
        name="Selecione a data do bom para"
        onCalendarVisibilityChange={setShowCalendar}
      />

      <Input
        className="flex-1"
        inputType={InputType.Money}
        onChange={handleSetAmount}
        value={receivedCheck.amount}
        name="Insira o valor do cheque"
      />

      <Input
        className="flex-1"
        onChange={handleSetNotes}
        value={receivedCheck.notes}
        name="Anotação de recebimento de cheque"
        inputType={InputType.Annotation}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          className="px-4 py-2"
          onClick={handleUpsertReceivedCheck}
          text={isEdit ? "Atualizar" : "Confirmar"}
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
