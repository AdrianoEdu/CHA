// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { useEffect, useState } from "react";
import Input, { InputType } from "../../input/page";
import { Regex } from "@/app/web/constants/regex";
import { FormatterResult } from "@/app/web/utils/inputFormatter";
import ComboBox from "../../combobox/page";
import { FinancialFlowType } from "@/app/web/constants/enum";
import Button from "../../button/page";
import { i18n } from "@/app/web/constants/i18n";
import {
  CreateFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "@/app/web/dto/financial.dto";

export type SelectComboboxProps = {
  label: string;
  value: FinancialFlowType;
};

const financialCategoryTypeLabels: Record<FinancialFlowType, string> = {
  IN: "Entrada",
  OUT: "Saída",
};

const options: SelectComboboxProps[] = (
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

export function UpsertFinancialCategory({
  data,
  onClose,
  onUpdated,
  onRegister,
}: Readonly<FinancialCategoryProps>) {
  const [name, setName] = useState("");
  const [showErrorRegex, setShowErrorRegex] = useState(false);
  const [selected, setSelected] = useState<SelectComboboxProps | undefined>();

  useEffect(() => {
    if (!data) return;

    setName(data.name!);
    setSelected(
      data.financialFlowType
        ? {
            label: financialCategoryTypeLabels[data.financialFlowType],
            value: data.financialFlowType,
          }
        : undefined,
    );
  }, [data]);

  const handleUpsertFinancialCategory = (): void => {
    if (onUpdated) {
      onUpdated({ id: data?.id!, name, financialFlowType: selected?.value });
      return;
    }

    if (onRegister) onRegister({ name, financialFlowType: selected?.value! });
  };

  return (
    <div className="flex flex-col w-full">
      <Input
        value={name}
        className="flex-1"
        regex={Regex.onlyText}
        regexError={showErrorRegex}
        onRegexError={setShowErrorRegex}
        name={"Infome a categoria financeira"}
        onChange={(e) => setName(e.target.value)}
        regexMessageError={
          "Por favor informar caracteres válidos (apenas texto)"
        }
      />

      <ComboBox
        options={options}
        valueKey={"value"}
        labelKey={"label"}
        selected={selected}
        onSelectOption={setSelected}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />
        <Button
          disabled={showErrorRegex}
          onPress={handleUpsertFinancialCategory}
          text={!data ? registerButton : updateButton}
        />
      </div>
    </div>
  );
}
