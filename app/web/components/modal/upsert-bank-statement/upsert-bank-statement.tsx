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
import UploadFile from "../../uploadFile/uploadFile";
import FileUpload from "../../uploadFile/uploadFile";

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
  const [file, setFile] = useState<File | null>(null);
  const [bankStatement, setBankStatement] = useState<GetBankStatementDto>();
  const [selected, setSelected] = useState<SelectComboboxProps | null>(null);

  const isRegister = !data;

  useEffect(() => {
    if (isRegister) return;

    setBankStatement(data);
  }, []);

  const handleSetBankStatement = (data: Partial<GetBankStatementDto>): void => {
    setBankStatement((prev) => {
      if (!prev) return undefined;

      return {
        ...prev,
        ...data,
      };
    });
  };

  return (
    <div className="flex flex-row w-300 h-100 mt-10 mb-10 gap-5 bg-gray-100 p-5 rounded-2xl">
      <div className="flex flex-col w-full gap-5 justify-center">
        <Input
          className="flex-1"
          name="Decrição do extrado"
          value={bankStatement?.title}
          onChange={(e) => handleSetBankStatement({ title: e.target.value })}
        />

        <Input
          className="flex-1"
          name="Decrição do extrado"
          inputType={InputType.Annotation}
          value={bankStatement?.description}
          onChange={(e) =>
            handleSetBankStatement({ description: e.target.value })
          }
        />

        <ComboBox<SelectComboboxProps>
          options={options}
          valueKey={"value"}
          labelKey={"label"}
          selected={selected}
          onSelectOption={setSelected}
          name="Selecione o tipo de extrado"
        />
        <Input
          name="Valor"
          className="flex-1"
          inputType={InputType.Money}
          value={bankStatement?.value}
          onChange={(e) =>
            handleSetBankStatement({ value: Number(e.target.value) })
          }
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <FileUpload value={file} onChange={setFile} maxSizeInMB={10} />
      </div>
    </div>
  );
}
