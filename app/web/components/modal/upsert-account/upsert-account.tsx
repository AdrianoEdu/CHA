
// Copyright (c) 2026-07-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CreateAccountDto,
  UpdateAccountDto,
} from "@/app/web/dto/account.dto";

import Button, { ButtonStatusEnum } from "../../button/button";
import ComboBox from "../../combobox/combobox";
import Input from "../../input/input";

import { bankService } from "@/app/web/services/bankService/bankService";

import { i18n } from "@/app/web/constants/i18n";


export type UpsertAccountModalProps = {
  data?: UpdateAccountDto;
  onClose: () => void;
  onUpdated?: (data: UpdateAccountDto) => void;
  onRegister?: (data: CreateAccountDto) => void;
};

type SelectOption = {
  id: string;
  name: string;
};

const { title, buttons, fields, messages, status } = i18n["Pt-Br"].Modal.UpsertAccount;

export default function UpsertAccountModal({
  data,
  onClose,
  onUpdated,
  onRegister,
}: UpsertAccountModalProps) {
  const isEdit = Boolean(data?.id);

  const [currentData, setCurrentData] = useState<UpdateAccountDto>({
    id: "",
    bankId: "",
    balance: 0,
    accountNumber: "",
    createdAt: new Date(),
  });

  const [listBankOptions, setListBankOptions] = useState<SelectOption[]>([]);
  const [selectedBank, setSelectedBank] = useState<SelectOption | undefined>();
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFindBanks = useCallback(async (): Promise<void> => {
    setLoadingBanks(true);
    setFormError("");

    try {
      const { banks } = await bankService.findAll({
        all: true,
        orderBy: {
          name: "asc",
        },
      });

      const options: SelectOption[] = banks.map((bank) => ({
        id: bank.id,
        name: bank.name,
      }));

      setListBankOptions(options);

      if (data?.bankId) {
        setSelectedBank(
          options.find((bank) => bank.id === data.bankId),
        );
      }
    } catch {
      setFormError(messages.loadBanksError);
    } finally {
      setLoadingBanks(false);
    }
  }, [data?.bankId]);

  useEffect(() => {
    void handleFindBanks();
  }, [handleFindBanks]);

  useEffect(() => {
    if (data) {
      setCurrentData(data);
    }
  }, [data]);

  const handleSelectOption = (option?: SelectOption): void => {
    setSelectedBank(option);

    setCurrentData((current) => ({
      ...current,
      bankId: option?.id,
    }));

    setFormError("");
  };

  const handleUpsertData = (
    values: Partial<UpdateAccountDto>,
  ): void => {
    setCurrentData((current) => ({
      ...current,
      ...values,
    }));

    setFormError("");
  };

  const handleSubmit = (): void => {
    if (!currentData) {
      setFormError(messages.loadAccountError);
      return;
    }

    if (!isEdit && !currentData.bankId) {
      setFormError(messages.selectBank);
      return;
    }

    if (!currentData.accountNumber?.trim()) {
      setFormError(messages.accountNumberRequired);
      return;
    }

    if (
      currentData.balance === undefined ||
      !Number.isFinite(Number(currentData.balance))
    ) {
      setFormError(messages.invalidBalance);
      return;
    }

    if (isEdit) {
      if (!onUpdated) {
        return;
      }

      onUpdated({
        ...currentData,
      });

      return;
    }

    if (!onRegister) {
      return;
    }

    const payload: CreateAccountDto = {
      accountNumber: currentData.accountNumber,
      balance: currentData.balance,
      bankId: currentData.bankId ?? "",
      createdAt: currentData.createdAt ?? new Date(),
    };

    onRegister(payload);
  };

  return (
    <div className="bg-white">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {isEdit
            ? title.edit
            : title.register}
        </h2>
      </div>

      <div className="flex flex-col gap-8 p-5">
        <div className="flex flex-col gap-2">
          <ComboBox
            valueKey="id"
            labelKey="name"
            disabled={isEdit || loadingBanks}
            selected={selectedBank}
            options={listBankOptions}
            name={fields.bank}
            onSelectOption={handleSelectOption}
          />

          {loadingBanks && (
            <p className="text-sm text-gray-500">
              {status.loadingBanks}
            </p>
          )}
        </div>

        <Input
          name={fields.accountNumber}
          value={currentData?.accountNumber ?? ""}
          onChange={(event) =>
            handleUpsertData({
              accountNumber: event.target.value,
            })
          }
        />

        <Input
          name={fields.balance}
          className="flex-1"
          value={currentData?.balance ?? ""}
          onChange={(event) =>
            handleUpsertData({
              balance:
                event.target.value === ""
                  ? 0
                  : Number(event.target.value),
            })
          }
        />

        {formError && (
          <p className="text-sm text-red-600">
            {formError}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text={buttons.cancel}
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          onClick={handleSubmit}
          className="px-4 py-2"
          text={
            isEdit
              ? buttons.update
              : buttons.confirm
          }
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
