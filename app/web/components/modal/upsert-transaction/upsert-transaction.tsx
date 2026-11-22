
// Copyright (c) 2026-04-25
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, JSX } from "react";
import Input, { InputType } from "../../input/input";
import Button, { ButtonStatusEnum } from "../../button/button";
import ComboBox from "../../combobox/combobox";
import {
  GetTrasnactionDTO,
  UpsertTransactionDto,
} from "@/app/web/dto/transaction.dto";
import { financialCategoryService } from "@/app/web/services/financialCategoryService/financialCategoryService";
import { GetFinancialCategoryDto } from "@/app/web/dto/financial.dto";
import { customerService } from "@/app/web/services/customerService/customerService";
import { GetCustomerDto } from "@/app/web/dto/customer.dto";
import CheckBox from "../../checkbox/checkbox";
import { TransactionStatus } from "@/app/web/constants/enum";

interface CheckUsageModalProps {
  onClose: () => void;
  onSubmit: (data: UpsertTransactionDto, isEdit?: boolean) => void;
  editData?: GetTrasnactionDTO;
}

type SelectOption = {
  id: string;
  name: string;
};

type TransactionForm = UpsertTransactionDto;

const mapperFinancialCategory = (
  data: GetFinancialCategoryDto | GetFinancialCategoryDto[],
): SelectOption[] => {
  const categories = Array.isArray(data) ? data : [data];

  return categories.map(({ id, name }) => ({
    id,
    name,
  }));
};

const mapperCustomer = (
  data: GetCustomerDto | GetCustomerDto[],
): SelectOption[] => {
  const customers = Array.isArray(data) ? data : [data];

  return customers.map(({ id, name }) => ({
    id,
    name,
  }));
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

export function UpsertTransaction({
  onClose,
  onSubmit,
  editData,
}: Readonly<CheckUsageModalProps>): JSX.Element {
  const [data, setData] = useState<TransactionForm>(() => ({
    id: editData?.id ?? "",
    amount: editData?.amount ?? 0,
    categoryId: editData?.category.id ?? "",
    customerId: editData?.customer.id ?? "",
    currentAmount: editData?.currentAmount ?? 0,
    dueDate: editData?.dueDate ?? new Date(),
    status: editData?.status ?? TransactionStatus.CREATED,
    settledAt: editData?.settledAt,
  }));

  const [flag, setFlag] = useState(Boolean(editData?.settledAt));
  const [loading, setLoading] = useState(true);

  const [financialCategoryOption, setFinancialCategoryOption] =
    useState<SelectOption | undefined>(undefined);
  const [financialCategoryList, setFinancialCategoryList] = useState<
    SelectOption[]
  >([]);

  const [customerList, setCustomerList] = useState<SelectOption[]>([]);
  const [customerOption, setCustomerOption] = useState<
    SelectOption | undefined
  >(undefined);

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async (): Promise<void> => {
      setLoading(true);

      try {
        const [
          { financialCategories },
          { customers },
        ] = await Promise.all([
          financialCategoryService.findAll({ all: true }),
          customerService.findAll({ all: true }),
        ]);

        if (!isMounted) return;

        const categories = mapperFinancialCategory(financialCategories);
        const customerOptions = mapperCustomer(customers);

        setFinancialCategoryList(categories);
        setCustomerList(customerOptions);

        setFinancialCategoryOption(
          categories.find(
            ({ id }) => id === editData?.category.id,
          ),
        );

        setCustomerOption(
          customerOptions.find(
            ({ id }) => id === editData?.customer.id,
          ),
        );
      } catch (error) {
        console.error("Erro ao carregar categorias e clientes:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadOptions();

    return () => {
      isMounted = false;
    };
  }, [editData?.category.id, editData?.customer.id]);

  const handleUpsertData = (
    value: Partial<UpsertTransactionDto>,
  ): void => {
    setData((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const handleSubmit = (): void => {
    onSubmit(
      {
        ...data,
        settledAt: flag ? new Date() : undefined,
      },
      Boolean(editData),
    );
  };

  const handleSelectFinancialCategory = (
    option?: SelectOption,
  ): void => {
    setFinancialCategoryOption(option);
    handleUpsertData({
      categoryId: option?.id ?? "",
    });
  };

  const handleSelectCustomerOption = (
    option?: SelectOption,
  ): void => {
    setCustomerOption(option);
    handleUpsertData({
      customerId: option?.id ?? "",
    });
  };

  const handleSetDueDate = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    const dueDate = value ? new Date(`${value}T00:00:00`) : undefined;

    if (dueDate && Number.isNaN(dueDate.getTime())) return;

    handleUpsertData({
      dueDate: dueDate ?? new Date(),
    });
  };

  const handleSetAmountValue = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    handleUpsertData({
      amount: parseMoneyToNumber(event.target.value),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 space-y-2 gap-4">
      <Input
        value={data.amount}
        name="Valor da transação"
        inputType={InputType.Money}
        onChange={handleSetAmountValue}
      />

      <ComboBox<SelectOption>
        valueKey="id"
        labelKey="name"
        options={financialCategoryList}
        selected={financialCategoryOption}
        label="Selecionar a categoria financeira"
        onSelectOption={handleSelectFinancialCategory}
      />

      <ComboBox<SelectOption>
        valueKey="id"
        labelKey="name"
        options={customerList}
        selected={customerOption}
        label="Selecionar o cliente:"
        onSelectOption={handleSelectCustomerOption}
      />

      <Input
        name="Data de vencimento"
        inputType={InputType.Date}
        value={data.dueDate}
        onChange={handleSetDueDate}
      />

      <CheckBox
        status={flag}
        text="Pagamento efetuado"
        onPress={() => setFlag((prev) => !prev)}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          onClick={handleSubmit}
          text={editData ? "Atualizar" : "Registrar"}
          status={editData ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
