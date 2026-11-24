
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
import { CreateReceivedCheckDTO } from "@/app/web/dto/receive-check.dto";
import { bankService } from "@/app/web/services/bankService/bankService";
import {
  CreateCashBookDto,
  UpdateCashBookDto,
} from "@/app/web/dto/cash-book.dto";

export type UpsertFinancialEntryModalProps = {
  onClose: () => void;
  accountType: AccountType;
  data?: GetFinancialEntryDto;
  onUpdate: (data: UpdateFinancialEntryDto | UpdateCashBookDto) => void;
  onRegister: (data: CreateFinancialEntryDto | CreateCashBookDto) => void;
};

type SelectOption = {
  id: string;
  name: string;
  list?: string[];
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

function parseMoneyToNumber(value: string): number {
  if (!value.trim()) return 0;

  const normalizedValue = value
    .replace(/\s/g, "")
    .replace(/R\$/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const amount = Number(normalizedValue);

  return Number.isFinite(amount) ? amount : 0;
}

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

  const [bankOptions, setBankOptions] = useState<SelectOption[]>([]);
  const [selectBankOption, setSelectBankOption] = useState<SelectOption>();

  const [agencyOptions, setAgencyOptions] = useState<SelectOption[]>([]);
  const [selectAgencyOption, setSelectAgencyOption] = useState<SelectOption>();

  const [showCalendar, setShowCalendar] = useState(false);

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

  const [receivedCheck, setRecevidedCheck] =
    useState<CreateReceivedCheckDTO>();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const isRegister = !data;

  const isIncome =
    selectedFinancialEntry?.value === FinancialFlowType.IN;

  const isReceivedCheck =
    accountType === AccountType.CASHBOOK &&
    selectedFinancialEntry?.label === "Recebimento de cheque de terceiro";

  const handleGetAllBanks = useCallback(async (): Promise<void> => {
    const { banks } = await bankService.findAll({
      orderBy: { name: "asc" },
    });

    setBankOptions(
      banks.map(({ id, name, agencies }) => ({
        id,
        name,
        list: agencies ?? [],
      })),
    );
  }, []);

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
          handleGetAllBanks(),
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
  }, [
    handleGetAllBanks,
    handleGetCustomerList,
    handleGetFinancialCategoryList,
  ]);

  const handleSetFinancialEntry = (
    values: Partial<FinancialEntryForm>,
  ): void => {
    setFinancialEntry((current) => ({
      ...current,
      ...values,
    }));

    setFormError("");
  };

  const handleSetReceivedCheck = (
    values: Partial<CreateReceivedCheckDTO>,
  ): void => {
    setRecevidedCheck((current) => ({
      ...(current ?? ({} as CreateReceivedCheckDTO)),
      ...values,
    }));
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

    if (option?.label !== "Recebimento de cheque de terceiro") {
      setSelectBankOption(undefined);
      setSelectAgencyOption(undefined);
      setAgencyOptions([]);
      setRecevidedCheck(undefined);
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

  const handleSelectBank = (option?: SelectOption): void => {
    setSelectBankOption(option);
    setSelectAgencyOption(undefined);

    setAgencyOptions(
      (option?.list ?? []).map((agency) => ({
        id: agency,
        name: agency,
      })),
    );

    handleSetReceivedCheck({
      bankId: option?.id,
      agency: undefined,
    });
  };

  const handleSelectAgency = (option?: SelectOption): void => {
    setSelectAgencyOption(option);

    handleSetReceivedCheck({
      agency: option?.name,
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

  const handleSetGoodForAt = (value: Date | string | number): void => {
    if (!value) return;

    const goodForAt = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(goodForAt.getTime())) return;

    handleSetReceivedCheck({ goodForAt });
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
      if (accountType === AccountType.CASHBOOK) {
        onUpdate({
          ...payload,
          id: financialEntry.id,
          accountId: financialEntry.accountId,
          customerId: financialEntry?.customer?.id,
          receivedCheck,
        });

        return;
      }

      onUpdate({
        ...payload,
        id: financialEntry.id,
        accountId: financialEntry.accountId,
        customerId: financialEntry?.customer?.id,
      });

      return;
    }

    if (accountType === AccountType.CASHBOOK) {
      onRegister({
        ...payload,
        accountId: financialEntry.accountId ?? "",
        customerId: financialEntry?.customer?.id ?? "",
        receivedCheck,
      });

      return;
    }

    onRegister({
      ...payload,
      accountId: financialEntry.accountId ?? "",
      customerId: financialEntry?.customer?.id ?? "",
    });
  };

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="mt-10 mb-6 flex min-h-[25rem] w-300 max-w-full flex-col gap-5 rounded-2xl bg-gray-100 p-5 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-5">
          <Input
            className="w-full"
            name={fields.descriptionStatement}
            value={financialEntry.title}
            onChange={(event) =>
              handleSetFinancialEntry({
                title: event.target.value,
              })
            }
          />

          <Input
            className="w-full"
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
            <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0 sm:col-span-2">
                <ComboBox<SelectComboboxCustomerTypeProps>
                  options={optionsCustomer}
                  valueKey="id"
                  labelKey="label"
                  selected={selectedCustomer}
                  name={fields.customer}
                  disabled={loading}
                  onSelectOption={handleSetSelectCustomerOption}
                />
              </div>

              {isReceivedCheck && (
                <>
                  <div className="min-w-0">
                    <ComboBox<SelectOption>
                      valueKey="id"
                      labelKey="name"
                      options={bankOptions}
                      selected={selectBankOption}
                      placeholder="Selecione o banco..."
                      disabled={loading}
                      onSelectOption={handleSelectBank}
                    />
                  </div>

                  <div className="min-w-0">
                    <ComboBox<SelectOption>
                      valueKey="id"
                      labelKey="name"
                      selected={selectAgencyOption}
                      options={agencyOptions}
                      disabled={loading || !selectBankOption}
                      onSelectOption={handleSelectAgency}
                      placeholder="Selecione a agência..."
                    />
                  </div>

                  <div className="min-w-0">
                    <Input
                      type="number"
                      className="w-full"
                      inputType={InputType.Number}
                      onChange={(event) =>
                        handleSetReceivedCheck({
                          checkNumber: Number(event.target.value),
                        })
                      }
                      value={receivedCheck?.checkNumber}
                      name="Insira o número do cheque"
                    />
                  </div>

                  <div className="min-w-0">
                    <Input
                      className="w-full"
                      inputType={InputType.Date}
                      showCalendar={showCalendar}
                      value={receivedCheck?.goodForAt}
                      onValueChange={handleSetGoodForAt}
                      name="Selecione a data do bom para"
                      onCalendarVisibilityChange={setShowCalendar}
                    />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <Input
                      className="w-full"
                      inputType={InputType.Money}
                      onChange={(event) =>
                        handleSetReceivedCheck({
                          amount: parseMoneyToNumber(event.target.value),
                        })
                      }
                      value={receivedCheck?.amount}
                      name="Insira o valor do cheque"
                    />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <Input
                      className="w-full"
                      value={receivedCheck?.notes}
                      inputType={InputType.Annotation}
                      name="Anotação de recebimento de cheque"
                      onChange={(event) =>
                        handleSetReceivedCheck({
                          notes: event.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {loading && (
            <p className="text-sm text-gray-500">
              {messages.loadingCategories}
            </p>
          )}

          <Input
            className="w-full"
            name={fields.value}
            inputType={InputType.Money}
            value={financialEntry.value}
            onChange={handleValueChange}
          />
        </div>

        <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 lg:w-[18.75rem]">
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

      <div className="flex w-full flex-wrap justify-end gap-3">
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
