
// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { type JSX, useCallback, useEffect, useState } from "react";

import { AccountType, FinancialFlowType } from "@/app/web/constants/enum";
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

import {
  SelectComboboxCustomerTypeProps,
  SelectComboboxFinancialFlowTypeProps,
} from "../upsert-financial-category/upsert-financial-category";

import { i18n } from "@/app/web/constants/i18n";
import { customerService } from "@/app/web/services/customerService/customerService";
import { GetCustomerDto } from "@/app/web/dto/customer.dto";

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
  customer: Partial<GetCustomerDto>;
};

const { cancel, register, update } = i18n["Pt-Br"].Components.Modal.Generic;
const { fields, messages } =
  i18n["Pt-Br"].Components.Modal.UpsertFinancialEntryModal;

const initialFormData: FinancialEntryForm = {
  value: 0,
  title: "",
  customer: {
    id: "",
    name: "",
  },
  description: "",
};

export function UpsertFinancialEntryModal({
  data,
  accountType,
  onClose,
  onUpdate,
  onRegister,
}: UpsertFinancialEntryModalProps): JSX.Element {
  const [optionsFinancialEntry, setOptionsFinancialEntry] = useState<
    SelectComboboxFinancialFlowTypeProps[]
  >([]);

  const [selectedFinancialEntry, setSelectedFinancialEntry] =
    useState<SelectComboboxFinancialFlowTypeProps | undefined>();

  const [optionsCustomer, setOptionsCustomer] = useState<
    SelectComboboxCustomerTypeProps[]
  >([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectComboboxCustomerTypeProps | undefined>();

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
        accountId: data.account?.id,
        customer: {
          id: data.customer?.id ?? "",
          name: data.customer?.name ?? "",
        },
        description: data.description,
        financialCategoryId: data.financialCategory?.id,
      };
    });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const isRegister = !data;

  const isIncome =
    selectedFinancialEntry?.value === FinancialFlowType.IN;

  const handleGetCustomerList = useCallback(
    async (): Promise<void> => {
      const { customers } = await customerService.findAll();

      const customersList: SelectComboboxCustomerTypeProps[] =
        customers.map((item) => ({
          id: item.id,
          label: item.name,
        }));

      setOptionsCustomer(customersList);

      if (data?.customer?.id) {
        setSelectedCustomer(
          customersList.find((item) => item.id === data.customer?.id),
        );
      }
    },
    [data?.customer?.id],
  );

  const handleGetFinancialCategoryList = useCallback(
    async (): Promise<void> => {
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

      setOptionsFinancialEntry(categories);

      if (data?.financialCategory?.id) {
        setSelectedFinancialEntry(
          categories.find(
            (item) => item.id === data.financialCategory?.id,
          ),
        );
      }
    },
    [accountType, data?.financialCategory?.id],
  );

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoading(true);
      setFormError("");

      try {
        await Promise.all([
          handleGetCustomerList(),
          handleGetFinancialCategoryList(),
        ]);
      } catch {
        setFormError(messages.loadCategoriesError);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [handleGetCustomerList, handleGetFinancialCategoryList]);

  const handleSetFinancialEntry = (
    values: Partial<FinancialEntryForm>,
  ): void => {
    setFinancialEntry((current) => ({
      ...current,
      ...values,
    }));

    setFormError("");
  };

  const handleSetSelectFinancialEntryOption = (
    option?: SelectComboboxFinancialFlowTypeProps,
  ): void => {
    setSelectedFinancialEntry(option);

    handleSetFinancialEntry({
      financialCategoryId: option?.id,
      customer:
        option?.value === FinancialFlowType.IN
          ? financialEntry.customer
          : { id: "", name: "" },
    });

    if (option?.value !== FinancialFlowType.IN) {
      setSelectedCustomer(undefined);
    }
  };

  const handleSetSelectCustomerOption = (
    option?: SelectComboboxCustomerTypeProps,
  ): void => {
    setSelectedCustomer(option);

    handleSetFinancialEntry({
      customer: {
        id: option?.id,
        name: option?.label,
      },
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
      ...(isIncome && financialEntry.customer.id
        ? { customerId: financialEntry.customer.id }
        : {}),
    };

    if (financialEntry.id) {
      onUpdate({
        ...payload,
        id: financialEntry.id,
        accountId: financialEntry.accountId,
        customerId: financialEntry?.customer?.id,
      });

      return;
    }

    onRegister({
      ...payload,
      accountId: financialEntry.accountId ?? "",
      customerId: financialEntry?.customer?.id ?? '',
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
            options={optionsFinancialEntry}
            valueKey="id"
            labelKey="label"
            selected={selectedFinancialEntry}
            name={fields.category}
            disabled={loading}
            onSelectOption={handleSetSelectFinancialEntryOption}
          />

          {isIncome && (
            <ComboBox<SelectComboboxCustomerTypeProps>
              options={optionsCustomer}
              valueKey="id"
              labelKey="label"
              selected={selectedCustomer}
              name={fields.customer}
              disabled={loading}
              onSelectOption={handleSetSelectCustomerOption}
            />
          )}

          {loading && (
            <p className="text-sm text-gray-500">
              {messages.loadingCategories}
            </p>
          )}

          <Input
            className="flex-1"
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
          status={
            isRegister
              ? ButtonStatusEnum.CONFIRM
              : ButtonStatusEnum.UPDATE
          }
          onPress={handleUpsertFinancialEntry}
        />
      </div>
    </div>
  );
}
