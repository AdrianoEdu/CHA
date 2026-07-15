// Copyright (c) 2026-07-06
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import {
  CreateCurrentAccountDto,
  UpdateCurrentAccountDto,
} from "@/app/web/dto/current-accont.dto";
import Button, { ButtonStatusEnum } from "../../button/button";
import { useEffect, useState } from "react";
import ComboBox from "../../combobox/combobox";
import { bankService } from "@/app/web/services/bankService/bankService";
import Input from "../../input/input";

export type UpsertCurrentAccountModalProps = {
  data?: UpdateCurrentAccountDto;
  onClose: () => void;
  onUpdated?: (data: UpdateCurrentAccountDto) => void;
  onRegister?: (data: CreateCurrentAccountDto) => void;
};

type SelectOption = { id: string; name: string };

export default function UpserCurrentAccountModal({
  data,
  onClose,
  onUpdated,
  onRegister,
}: UpsertCurrentAccountModalProps) {
  const isEdit = !!data;
  const [currentData, setCurrentData] = useState<
    UpdateCurrentAccountDto | undefined
  >(data);

  const [listBankOptions, setListBank] = useState<SelectOption[]>([]);
  const [selectedBank, setSelectBank] = useState<SelectOption | null>(null);

  useEffect(() => {
    if (isEdit) {
      findBankById(data.bankId!);
      return;
    }

    handleFindBanks();
  }, []);

  const handleFindBanks = async () => {
    const { banks } = await bankService.findAll({
      all: true,
      orderBy: { name: "asc" },
    });

    setListBank(
      banks.map((b) => ({
        id: b.id,
        name: b.name,
      })),
    );
  };

  const findBankById = async (id: string): Promise<void> => {
    const { banks } = await bankService.findAll({
      where: { id },
    });

    setSelectBank({ id: banks[0].id, name: banks[0].name });
  };

  const handleSelectOption = (option: SelectOption | null): void => {
    setSelectBank(option);
    setCurrentData((prev) => ({ ...prev!, bankId: option?.id }));
  };

  const handleUpserData = (data: Partial<UpdateCurrentAccountDto>): void => {
    setCurrentData((prev) => ({ ...prev!, ...data }));
  };

  const handleSubmit = (): void => {
    if (isEdit && onUpdated) onUpdated({ ...currentData! });

    if (onRegister)
      onRegister({
        accountNumber: currentData?.accountNumber!,
        balance: currentData?.balance!,
        bankId: currentData?.bankId!,
        createdAt: currentData?.createdAt!,
      });
  };

  return (
    <div className="bg-white">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Editar conta corrente" : "Registrar conta corrente"}
        </h2>
      </div>

      <div className="flex flex-col w-full gap-2">
        <ComboBox
          valueKey="id"
          labelKey="name"
          disabled={isEdit}
          selected={selectedBank}
          options={listBankOptions}
          onSelectOption={handleSelectOption}
        />

        <Input
          name={"Número da conta"}
          value={currentData?.accountNumber}
          onChange={(e) => handleUpserData({ accountNumber: e.target.value })}
        />

        <Input
          name={"Saldo"}
          className={"flex-1"}
          value={currentData?.balance}
          onChange={(e) => handleUpserData({ balance: Number(e.target.value) })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          onClick={handleSubmit}
          className={"px-4 py-2"}
          text={isEdit ? "Atualizar" : "Confirmar"}
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
