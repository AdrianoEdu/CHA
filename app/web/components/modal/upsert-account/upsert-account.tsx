
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

export default function UpsertAccountModal({
  data,
  onClose,
  onUpdated,
  onRegister,
}: UpsertAccountModalProps) {
  const isEdit = Boolean(data?.id);

  const [currentData, setCurrentData] = useState<UpdateAccountDto | undefined>(
    data,
  );

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
      setFormError("Não foi possível carregar os bancos. Tente novamente.");
    } finally {
      setLoadingBanks(false);
    }
  }, [data?.bankId]);

  useEffect(() => {
    void handleFindBanks();
  }, [handleFindBanks]);

  const handleSelectOption = (option?: SelectOption): void => {
    setSelectedBank(option);

    setCurrentData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        bankId: option?.id,
      };
    });

    setFormError("");
  };

  const handleUpsertData = (
    values: Partial<UpdateAccountDto>,
  ): void => {
    setCurrentData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...values,
      };
    });

    setFormError("");
  };

  const handleSubmit = (): void => {
    if (!currentData) {
      setFormError("Não foi possível carregar os dados da conta.");
      return;
    }

    if (!isEdit && !currentData.bankId) {
      setFormError("Selecione um banco.");
      return;
    }

    if (!currentData.accountNumber?.trim()) {
      setFormError("Informe o número da conta.");
      return;
    }

    if (currentData.balance === undefined || !Number.isFinite(Number(currentData.balance))) {
      setFormError("Informe um saldo válido.");
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
      bankId: currentData.bankId ?? '',
      createdAt: currentData.createdAt ?? new Date(),
    };

    onRegister(payload);
  };

  return (
    <div className="bg-white">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Editar conta corrente" : "Registrar conta corrente"}
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
            name="Banco"
            onSelectOption={handleSelectOption}
          />

          {loadingBanks && (
            <p className="text-sm text-gray-500">
              Carregando bancos...
            </p>
          )}
        </div>

        <Input
          name="Número da conta"
          value={currentData?.accountNumber ?? ""}
          onChange={(event) =>
            handleUpsertData({
              accountNumber: event.target.value,
            })
          }
        />

        <Input
          name="Saldo"
          className="flex-1"
          value={currentData?.balance ?? ""}
          onChange={(event) =>
            handleUpsertData({
              balance: event.target.value === ""
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
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          onClick={handleSubmit}
          className="px-4 py-2"
          text={isEdit ? "Atualizar" : "Confirmar"}
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
