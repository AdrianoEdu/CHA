// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType } from "@/app/web/constants/enum";
import { JSX, useEffect, useState } from "react";
import Input, { InputType } from "../../input/input";
import ComboBox from "../../combobox/combobox";
import { SelectComboboxProps } from "../upsert-financial-category/upsert-financial-category";
import FileUpload from "../../uploadFile/uploadFile";
import Button, { ButtonStatusEnum } from "../../button/button";
import { financialCategoryService } from "@/app/web/services/financialCategoryService/financialCategoryService";
import {
  CreateFinancialEntryDto,
  GetFinancialEntryDto,
  UpdateFinancialEntryDto,
} from "@/app/web/dto/general.dto";

export type UpsertFinancialEntryModalProps = {
  onClose: () => void;
  data?: GetFinancialEntryDto;
  onUpdate: (data: UpdateFinancialEntryDto) => void;
  onRegister: (data: CreateFinancialEntryDto) => void;
};

type FinancialEntryForm = {
  id?: string;
  file: File | null;
  value: number;
  title: string;
  createdAt?: Date;
  description: string;
  currentAccount?: GetFinancialEntryDto["currentAccount"];
  financialCategory?: GetFinancialEntryDto["financialCategory"];
};

export function UpsertFinancialEntryModal({
  data,
  onClose,
  onUpdate,
  onRegister,
}: UpsertFinancialEntryModalProps): JSX.Element {
  const [options, setOptions] = useState<SelectComboboxProps[]>([]);
  const [selected, setSelected] = useState<SelectComboboxProps | null>(null);

  const [financialEntry, setFinancialEntry] = useState<FinancialEntryForm>(
    (): FinancialEntryForm => {
      if (!data) {
        return {} as FinancialEntryForm;
      }

      return {
        id: data.id,
        // file: data.file ?? null,
        file: null,
        value: data.value,
        title: data.title,
        createdAt: data.createdAt,
        description: data.description,
        currentAccount: data.currentAccount,
        financialCategory: data.financialCategory,
      };
    },
  );

  const isRegister = !data;

  useEffect(() => {
    handleGetFinancialCategoryList(data);
  }, [data]);

  const handleGetFinancialCategoryList = async (
    financialEntryData?: GetFinancialEntryDto,
  ): Promise<void> => {
    const { financialCategories } = await financialCategoryService.findAll({
      all: true,
    });

    const map: SelectComboboxProps[] = financialCategories.map((item) => ({
      id: item.id,
      label: item.name,
      value: item.financialFlowType,
    }));

    if (financialEntryData) {
      const firstItem = map.find(
        (item) => item.id === financialEntryData.financialCategory.id,
      );

      if (firstItem) {
        setSelected(firstItem);
      }
    }

    setOptions(map);
  };

  const handleSetFinancialEntry = (data: Partial<FinancialEntryForm>): void => {
    setFinancialEntry((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleSetSelectOption = (option: SelectComboboxProps | null): void => {
    if (!option) return;

    handleSetFinancialEntry({
      financialCategory: {
        name: option.label,
        id: option.id ?? "",
        createdAt: new Date(),
        financialFlowType: option.value,
      },
    });

    setSelected(option);
  };

  const handleUpsertFinancialEntry = (): void => {
    const {
      id,
      value,
      title,
      description,
      currentAccount,
      financialCategory,
      file: formFile,
      ...formData
    } = financialEntry;

    if (id) {
      onUpdate({
        ...formData,
        id,
        title,
        value,
        description,
        file: formFile,
        currentAccountId: currentAccount?.id,
        financialCategoryId: financialCategory?.id,
      });

      return;
    }

    onRegister({
      ...formData,
      title,
      value,
      description,
      file: formFile,
      currentAccountId: currentAccount?.id ?? "",
      financialCategoryId: financialCategory?.id ?? "",
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-300 h-100 mt-10 mb-10 gap-5 bg-gray-100 p-5 rounded-2xl">
        <div className="flex flex-col w-full gap-5 justify-center">
          <Input
            className="flex-1"
            name="Descrição do extrato"
            value={financialEntry.title}
            onChange={(e) =>
              handleSetFinancialEntry({
                title: e.target.value,
              })
            }
          />

          <Input
            className="flex-1"
            name="Descrição do extrato"
            inputType={InputType.Annotation}
            value={financialEntry.description}
            onChange={(e) =>
              handleSetFinancialEntry({
                description: e.target.value,
              })
            }
          />

          <ComboBox<SelectComboboxProps>
            options={options}
            valueKey="value"
            labelKey="label"
            selected={selected}
            name="Selecione a categoria do extrato"
            onSelectOption={handleSetSelectOption}
          />

          <Input
            name="Valor"
            className="flex-1"
            inputType={InputType.Money}
            value={financialEntry.value}
            onChange={(e) =>
              handleSetFinancialEntry({
                value: Number(
                  e.target.value
                    .replace(/\s/g, "")
                    .replace("R$", "")
                    .replace(/\./g, "")
                    .replace(",", "."),
                ),
              })
            }
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <FileUpload
            maxSizeInMB={10}
            value={financialEntry.file}
            onChange={(file) => handleSetFinancialEntry({ file })}
          />
        </div>
      </div>

      <div className="flex w-full justify-end gap-5">
        <Button
          text="Cancelar"
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          text={isRegister ? "Registrar" : "Atualizar"}
          status={ButtonStatusEnum.CONFIRM}
          onPress={handleUpsertFinancialEntry}
        />
      </div>
    </div>
  );
}
