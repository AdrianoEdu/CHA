
// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { type JSX, useCallback, useEffect, useState } from "react";

import { AccountType } from "@/app/web/constants/enum";
import {
  CreateFinancialEntryDto,
  GetFinancialEntryDto,
  UpdateFinancialEntryDto,
} from "@/app/web/dto/general.dto";

import Input, { InputType } from "../../input/input";
import ComboBox from "../../combobox/combobox";
import FileUpload from "../../uploadFile/uploadFile";
import Button, { ButtonStatusEnum } from "../../button/button";

import { financialCategoryService } from "@/app/web/services/financialCategoryService/financialCategoryService";

import { SelectComboboxFinancialFlowTypeProps } from "../upsert-financial-category/upsert-financial-category";
import { i18n } from "@/app/web/constants/i18n";

export type UpsertFinancialEntryModalProps = {
  onClose: () => void;
  accountType: AccountType;
  data?: GetFinancialEntryDto;
  onUpdate: (data: UpdateFinancialEntryDto) => void;
  onRegister: (data: CreateFinancialEntryDto) => void;
};

type FinancialEntryForm = {
  id?: string;
  file?: File;
  value: number;
  title: string;
  createdAt?: Date;
  description: string;
  accountId?: string;
  financialCategoryId?: string;
};

const { cancel, register, update } = i18n["Pt-Br"].Components.Modal.Generic;
const { fields, messages } = i18n["Pt-Br"].Components.Modal.UpsertFinancialEntryModal;

const initialFormData: FinancialEntryForm = {
  value: 0,
  title: "",
  description: "",
};

export function UpsertFinancialEntryModal({
  data,
  accountType,
  onClose,
  onUpdate,
  onRegister,
}: UpsertFinancialEntryModalProps): JSX.Element {
  const [options, setOptions] = useState<
    SelectComboboxFinancialFlowTypeProps[]
  >([]);

  const [selected, setSelected] =
    useState<SelectComboboxFinancialFlowTypeProps | undefined>();

  const [financialEntry, setFinancialEntry] =
    useState<FinancialEntryForm>(() => {
      if (!data) {
        return initialFormData;
      }

      return {
        id: data.id,
        value: data.value,
        title: data.title,
        createdAt: data.createdAt,
        description: data.description,
        accountId: data.account?.id,
        financialCategoryId: data.financialCategory?.id,
      };
    });

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formError, setFormError] = useState("");

  const isRegister = !data;

  const handleGetFinancialCategoryList = useCallback(
    async (): Promise<void> => {
      setLoadingCategories(true);
      setFormError("");

      try {
        const { financialCategories } =
          await financialCategoryService.findAll({
            all: true,
            where: { accountType },
          });

        const categories: SelectComboboxFinancialFlowTypeProps[] =
          financialCategories.map((item) => ({
            id: item.id,
            label: item.name,
            value: item.financialFlowType,
          }));

        setOptions(categories);

        if (data?.financialCategory?.id) {
          setSelected(
            categories.find(
              (item) => item.id === data.financialCategory?.id,
            ),
          );
        }
      } catch {
        setFormError(messages.loadCategoriesError);
      } finally {
        setLoadingCategories(false);
      }
    },
    [accountType, data?.financialCategory?.id],
  );

  useEffect(() => {
    void handleGetFinancialCategoryList();
  }, [handleGetFinancialCategoryList]);

  const handleSetFinancialEntry = (
    values: Partial<FinancialEntryForm>,
  ): void => {
    setFinancialEntry((current) => ({
      ...current,
      ...values,
    }));

    setFormError("");
  };

  const handleSetSelectOption = (
    option?: SelectComboboxFinancialFlowTypeProps,
  ): void => {
    setSelected(option);

    handleSetFinancialEntry({
      financialCategoryId: option?.id,
    });
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".");

    handleSetFinancialEntry({
      value: Number(value) || 0,
    });
  };

  const handleUpsertFinancialEntry = (): void => {
    const title = financialEntry.title.trim();

    if (!title) {
      setFormError(messages.requiredTitle);
      return;
    }

    if (!financialEntry.financialCategoryId) {
      setFormError(messages.requiredCategory);
      return;
    }

    if (!Number.isFinite(financialEntry.value) || financialEntry.value <= 0) {
      setFormError(messages.invalidValue);
      return;
    }

    const payload = {
      title,
      value: financialEntry.value,
      description: financialEntry.description,
      file: financialEntry.file,
      financialCategoryId: financialEntry.financialCategoryId,
    };

    if (financialEntry.id) {
      onUpdate({
        ...payload,
        id: financialEntry.id,
        accountId: financialEntry.accountId,
      });

      return;
    }

    onRegister({
      ...payload,
      accountId: financialEntry.accountId ?? "",
    });
  };

  return (
    <div className="flex flex-col">
      <div className="mt-10 mb-10 flex h-100 w-300 flex-row gap-5 rounded-2xl bg-gray-100 p-5">
        <div className="flex w-full flex-col justify-center gap-5">
          <Input
            className="flex-1"
            name={fields.descriptionStatement}
            value={financialEntry.title}
            onChange={(event) =>
              handleSetFinancialEntry({
                title: event.target.value,
              })
            }
          />

          <Input
            className="flex-1"
            name={fields.notes}
            inputType={InputType.Annotation}
            value={financialEntry.description}
            onChange={(event) =>
              handleSetFinancialEntry({
                description: event.target.value,
              })
            }
          />

          <ComboBox
            options={options}
            valueKey="id"
            labelKey="label"
            selected={selected}
            name={fields.category}
            disabled={loadingCategories}
            onSelectOption={handleSetSelectOption}
          />

          {loadingCategories && (
            <p className="text-sm text-gray-500"> {messages.loadingCategories} </p>
          )}

          <Input
            className="flex-1" i980p---
            name={fields.value}
            inputType={InputType.Money}
            value={financialEntry.value}
            onChange={handleValueChange}
          />
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          <FileUpload
            maxSizeInMB={10}
            value={financialEntry.file}
            onChange={(file) =>
              handleSetFinancialEntry({
                file: file ?? undefined,
              })
            }
          />
        </div>
      </div>

      {formError && (
        <p className="mb-4 text-sm text-red-600">
          {formError}
        </p>
      )}

      <div className="flex w-full justify-end gap-5">
        <Button
          text={cancel}
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          text={isRegister ? register : update}
          status={isRegister ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE}
          onPress={handleUpsertFinancialEntry}
        />
      </div>
    </div>
  );
}
