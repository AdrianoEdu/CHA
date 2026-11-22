
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

const { cancel, register, update } = i18n["Pt-Br"].Components.Modal.Generic;
const { FinancialCategory } = i18n['Pt-Br'].Components.ComboBox;

const financialCategoryTypeLabels: Record<FinancialFlowType, string> = {
  IN: FinancialCategory.FINANCIAL_FLOW.IN,
  OUT: FinancialCategory.FINANCIAL_FLOW.OUT,
};

const options: SelectComboboxFinancialFlowTypeProps[] = (
  Object.values(FinancialFlowType) as FinancialFlowType[]
).map((type) => ({
  value: type,
  label: financialCategoryTypeLabels[type],
}));

const accountTypeOptions: SelectComboboxAccountTypeProps[] = [
  { label: FinancialCategory.ACCOUNT_TYPE.BANK, value: AccountType.BANK },
  { label: FinancialCategory.ACCOUNT_TYPE.CASHBOOK, value: AccountType.CASHBOOK },
];

type FinancialCategoryProps = {
  data?: UpdateFinancialCategoryDto;
  onClose: () => void;
  onUpdated?: (data: UpdateFinancialCategoryDto) => void;
  onRegister?: (data: CreateFinancialCategoryDto) => void;
};

export default function UpsertFinancialCategory({
  data,
  onClose,
  onUpdated,
  onRegister,
}: Readonly<FinancialCategoryProps>) {
  const [name, setName] = useState("");
  const [selected, setSelected] =
    useState<SelectComboboxFinancialFlowTypeProps | undefined>(undefined);
  const [accountTypeSelect, setAccountTypeSelect] =
    useState<SelectComboboxAccountTypeProps | undefined>(undefined);

  useEffect(() => {
    if (!data) {
      setName("");
      setSelected(undefined);
      setAccountTypeSelect(undefined);
      return;
    }

    setName(data.name ?? '');

    setSelected(
      data.financialFlowType
        ? {
          label: financialCategoryTypeLabels[data.financialFlowType],
          value: data.financialFlowType,
        }
        : undefined,
    );

    setAccountTypeSelect(
      data.accountType
        ? accountTypeOptions.find(
          (option) => option.value === data.accountType,
        )
        : undefined,
    );
  }, [data]);

  const handleUpsertFinancialCategory = (): void => {
    if (onUpdated && data?.id) {
      onUpdated({
        id: data.id,
        name,
        financialFlowType: selected?.value,
        accountType: accountTypeSelect?.value,
      });
      return;
    }

    if (onRegister && selected && accountTypeSelect) {
      onRegister({
        name,
        financialFlowType: selected.value,
        accountType: accountTypeSelect.value,
      });
    }
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
        options={accountTypeOptions}
        valueKey={"value"}
        labelKey={"label"}
        selected={accountTypeSelect}
        onSelectOption={setAccountTypeSelect}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button
          text={cancel}
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          disabled={
            name.trim() === "" ||
            (!data && (!selected || !accountTypeSelect))
          }
          onPress={handleUpsertFinancialCategory}
          text={!data ? register : update}
          status={!data ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE}
        />
      </div>
    </div>
  );
}
