// Copyright (c) 2026-04-25
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { ChangeEvent, JSX, useEffect, useState } from "react";
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

type SelectOption = { id: string; name: string };

const mapperFinancialCategory = (
  data: GetFinancialCategoryDto | GetFinancialCategoryDto[],
): SelectOption[] => {
  if (Array.isArray(data))
    return data.map((financialCategory) => ({
      id: financialCategory.id,
      name: financialCategory.name,
    }));

  return [{ id: data.id, name: data.name }];
};

const mapperCustomer = (
  data: GetCustomerDto | GetCustomerDto[],
): SelectOption[] => {
  if (Array.isArray(data))
    return data.map((customer) => ({
      id: customer.id,
      name: customer.name,
    }));

  return [{ id: data.id, name: data.name }];
};

export function UpsertTransaction({
  onClose,
  onSubmit,
  editData,
}: CheckUsageModalProps): JSX.Element {
  const [data, setData] = useState<UpsertTransactionDto>({
    id: "",
    amount: 0,
    categoryId: "",
    customerId: "",
    currentAmount: 0,
    dueDate: new Date(),
    status: TransactionStatus.CREATED,
  });

  const [flag, setFlag] = useState(false);
  const [date, setDate] = useState<Date>();

  const [financialCategoryOption, setFinancialCategoryOption] =
    useState<SelectOption | null>(null);
  const [financialCategoryList, setFinancialCategoryList] = useState<
    SelectOption[]
  >([]);

  const [customerList, setCustomerList] = useState<SelectOption[]>([]);
  const [customerOption, setCustomerOption] = useState<SelectOption | null>(
    null,
  );

  useEffect(() => {
    getAllCustomer();
    getAllFinancialCategory();

    if (editData) {
      setData({
        id: editData.id,
        amount: editData.amount,
        dueDate: editData.dueDate,
        categoryId: editData.category.id,
        customerId: editData.customer.id,
      } as UpsertTransactionDto);
    }
  }, []);

  const getAllFinancialCategory = async (): Promise<void> => {
    const { financial } = await financialCategoryService.findAll({ all: true });

    if (editData && Array.isArray(financial)) {
      const filter = financial.filter(
        (item) => item.id === editData.category.id,
      );

      const [firstItem] = mapperFinancialCategory(filter);

      setFinancialCategoryOption(firstItem);
    }

    setFinancialCategoryList(mapperFinancialCategory(financial));
  };

  const getAllCustomer = async (): Promise<void> => {
    const { customers } = await customerService.findAll({ all: true });

    if (editData && Array.isArray(customers)) {
      const filter = customers.filter(
        (item) => item.id === editData.customer.id,
      );
      const [firstItem] = mapperCustomer(filter);

      setCustomerOption(firstItem);
    }

    setCustomerList(mapperCustomer(customers));
  };

  const handleSubmit = () => {
    onSubmit({ ...data, settledAt: flag ? new Date() : undefined });
  };

  const handleSelectFinancialCategory = (option: SelectOption | null): void => {
    if (!option) return;

    setFinancialCategoryOption(option);

    handleUpsertData({ categoryId: option.id });
  };

  const handleSelectCustomerOption = (option: SelectOption | null): void => {
    if (!option) return;

    setCustomerOption(option);

    handleUpsertData({ customerId: option.id });
  };

  const handleUpsertData = (data: Partial<UpsertTransactionDto>): void => {
    setData((prev) => ({ ...prev, ...data }));
  };

  const handleSetDueDate = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    handleUpsertData({ dueDate: new Date(e.target.value) });
  };

  const handleSetAmountValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const amount = Number(
      e.target.value
        .replace(/\s/g, "")
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", "."),
    );

    handleUpsertData({ amount });
  };

  return (
    <div className="flex flex-col p-6 space-y-2 gap-4">
      <Input
        value={data.amount}
        name="Valor da tranasação"
        inputType={InputType.Money}
        onChange={handleSetAmountValue}
      />

      <ComboBox
        valueKey={"id"}
        labelKey={"name"}
        options={financialCategoryList}
        selected={financialCategoryOption}
        label={"Selecionar a categoria financeira"}
        onSelectOption={handleSelectFinancialCategory}
      />

      <ComboBox
        valueKey={"id"}
        labelKey={"name"}
        options={customerList}
        selected={customerOption}
        label="Selecionar o cliente :"
        onSelectOption={handleSelectCustomerOption}
      />

      <Input
        name="Data de vencimento"
        inputType={InputType.Date}
        value={date?.toISOString()}
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
