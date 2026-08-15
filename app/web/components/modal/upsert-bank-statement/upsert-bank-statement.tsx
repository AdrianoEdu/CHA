// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { i18n } from "@/app/web/constants/i18n";
import {
  CreateBankStatementDto,
  GetBankStatementDto,
  UpdateBankStatementDto,
} from "@/app/web/dto/bank-statemenrt-dto";
import { JSX, useEffect, useState } from "react";
import Input, { InputType } from "../../input/input";
import ComboBox from "../../combobox/combobox";
import { SelectComboboxProps } from "../upsert-financial-category/upsert-financial-category";
import { FinancialFlowType } from "@/app/web/constants/enum";

export type UpsertBankStatementModalProps = {
  data?: GetBankStatementDto;
  onRegister: (data: CreateBankStatementDto) => void;
  onUpdate: (data: UpdateBankStatementDto) => void;
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

const defaultBankStatement = {};

export function UpsertBankStatementModal({
  data,
  onUpdate,
  onRegister,
}: UpsertBankStatementModalProps): JSX.Element {
  const [bankStatement, setBankStatement] = useState<GetBankStatementDto>();
  const [selected, setSelected] = useState<SelectComboboxProps | null>(null);

  const isRegister = !data;

  useEffect(() => {
    if (isRegister) return;

    setBankStatement(data);
  }, []);

  return (
    <div className="flex flex-row w-250 h-100 mt-10 mb-10">
      <div className="flex flex-col w-1/2 bg-amber-600 gap-5">
        <Input className="flex-1" name="Titulo do extrato" />
        <Input
          className="flex-1"
          name="Decrição do extrado"
          inputType={InputType.Annotation}
        />

        <ComboBox<SelectComboboxProps>
          options={options}
          valueKey={"value"}
          labelKey={"label"}
          selected={selected}
          onSelectOption={setSelected}
        />

        <Input name="Valor" className="flex-1" inputType={InputType.Money} />
      </div>
      <div className="flex flex-col bg-amber-900"></div>
    </div>
  );
}
