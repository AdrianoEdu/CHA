// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useEffect, useState } from "react";
import Input from "../../input/input";
import ComboBox from "../../combobox/combobox";
import { AccountType, FinancialFlowType } from "@/app/web/constants/enum";
import Button, { ButtonStatusEnum } from "../../button/button";
import { i18n } from "@/app/web/constants/i18n";
import {
  CreateFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "@/app/web/dto/financial.dto";

export type SelectComboboxFinancialFlowTypeProps = {
  id?: string;
  label: string;
  value: FinancialFlowType;
};

export type SelectComboboxAccountTypeProps = {
  id?: string;
  label: string;
  value: AccountType;
};

const financialCategoryTypeLabels: Record<FinancialFlowType, string> = {
  IN: "Entrada",
  OUT: "Saída",
};

const options: SelectComboboxFinancialFlowTypeProps[] = (
  Object.values(FinancialFlowType) as FinancialFlowType[]
).map((type) => ({
  value: type,
  label: financialCategoryTypeLabels[type],
}));

type FinancialCategoryProps = {
  data?: UpdateFinancialCategoryDto;
  onClose: () => void;
  onUpdated?: (data: UpdateFinancialCategoryDto) => void;
  onRegister?: (data: CreateFinancialCategoryDto) => void;
};

const { cancelButton, registerButton, updateButton } = i18n["Pt-Br"].Modal;

export default function UpsertFinancialCategory({
  data,
  onClose,
  onUpdated,
  onRegister,
}: Readonly<FinancialCategoryProps>) {
  const [name, setName] = useState("");
  const [selected, setSelected] =
    useState<SelectComboboxFinancialFlowTypeProps | null>(null);
  const [accountTypeSelect, setAccountTypeSelect] =
    useState<SelectComboboxAccountTypeProps | null>(null);

  useEffect(() => {
    if (!data) return;

    setName(data.name!);
    setSelected(
      data.financialFlowType
        ? {
            label: financialCategoryTypeLabels[data.financialFlowType],
            value: data.financialFlowType,
          }
        : null,
    );
  }, [data]);

  const handleUpsertFinancialCategory = (): void => {
    if (onUpdated) {
      onUpdated({
        id: data?.id!,
        name,
        financialFlowType: selected?.value,
        accountType: accountTypeSelect?.value,
      });
      return;
    }

    if (onRegister)
      onRegister({
        name,
        financialFlowType: selected?.value!,
        accountType: accountTypeSelect?.value!,
      });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <Input
        value={name}
        className="flex-1"
        name={"Infome a categoria financeira"}
        onChange={(e) => setName(e.target.value)}
      />

      <ComboBox<SelectComboboxFinancialFlowTypeProps>
        options={options}
        valueKey={"value"}
        labelKey={"label"}
        selected={selected}
        onSelectOption={setSelected}
      />

      <ComboBox<SelectComboboxAccountTypeProps>
        options={[
          { label: "Banco", value: AccountType.BANK },
          { label: "Livro Caixa", value: AccountType.CASHBOOK },
        ]}
        valueKey={"value"}
        labelKey={"label"}
        selected={accountTypeSelect}
        onSelectOption={setAccountTypeSelect}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button
          text={cancelButton}
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />
        <Button
          disabled={name === ""}
          onPress={handleUpsertFinancialCategory}
          text={!data ? registerButton : updateButton}
          status={!data ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE}
        />
      </div>
    </div>
  );
}
