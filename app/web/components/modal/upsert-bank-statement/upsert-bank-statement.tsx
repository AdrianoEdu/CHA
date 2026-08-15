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
import { SelectComboboxProps } from "@/upsert-customer/page";

export type UpsertBankStatementModalProps = {
  data?: GetBankStatementDto;
  onRegister: (data: CreateBankStatementDto) => void;
  onUpdate: (data: UpdateBankStatementDto) => void;
};

export function UpsertBankStatementModal({
  data,
  onUpdate,
  onRegister,
}: UpsertBankStatementModalProps): JSX.Element {
  const [bankStatement, setBankStatement] = useState<GetBankStatementDto>();

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
      </div>
      <div className="flex flex-col bg-amber-900"></div>
    </div>
  );
}

// model BankStatement {
//   id                   String @id @default(uuid())
//   value                Float
//   title                String
//   description          String

//   currentAccountId     String
//   currentAccount       CurrentAccount @relation(fields: [currentAccountId], references: [id])

//   financialCategoryId  String
//   financialCategory    FinancialCategory @relation(fields: [financialCategoryId], references: [id])

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
