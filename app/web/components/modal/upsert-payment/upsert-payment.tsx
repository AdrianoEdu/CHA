// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { FinancialFlowType, RecipientTypeEnum } from "@/app/web/constants/enum";
import { CreatePaymentDto, UpdatePaymentDto } from "@/app/web/dto/payment";
import { customerService } from "@/app/web/services/customerService/customerService";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { financialCategoryService } from "@/app/web/services/financialCategoryService/financialCategoryService";
import { ChangeEvent, JSX, useEffect, useState } from "react";
import Input, { InputType } from "../../input/input";
import ComboBox from "../../combobox/combobox";
import ComboBoxIcon, {
  ComboBoxIconOption,
} from "../../comboboxIcon/ComboboxIcon";
import { UsersIcon } from "@/app/web/icons";
import Button, { ButtonStatusEnum } from "../../button/button";

type SelectOption = { id: string; name: string };

interface PaymentModalProps {
  data?: UpdatePaymentDto;
  onClose: () => void;
  onEdit: (data: UpdatePaymentDto) => void;
  onRegister: (data: CreatePaymentDto) => void;
}

const recipientOptions: ComboBoxIconOption[] = [
  {
    value: RecipientTypeEnum.EMPLOYEE,
    label: "Funcionário",
    description: "Pagamento destinado a um funcionário",
    icon: <UsersIcon />,
  },
  {
    value: RecipientTypeEnum.CUSTOMER,
    label: "Cliente",
    description: "Pagamento associado a um cliente",
    icon: <UsersIcon />,
  },
];

function parseMoneyToNumber(value: string): number {
  if (!value) return 0;

  return Number(
    value
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim(),
  );
}

export default function UpsertPaymentModal({
  data,
  onEdit,
  onClose,
  onRegister,
}: PaymentModalProps): JSX.Element {
  const isEdit = Boolean(data);

  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const [recipientType, setRecipientType] = useState<RecipientTypeEnum>(
    RecipientTypeEnum.EMPLOYEE,
  );

  const [optionCustomer, setOptionCustomer] = useState<SelectOption[]>([]);

  const [optionEmployee, setOptionEmployee] = useState<SelectOption[]>([]);

  const [optionsFinancialCategory, setOptionsFinancialCategory] = useState<
    SelectOption[]
  >([]);

  const [paymentList, setPaymentList] = useState<UpdatePaymentDto>({
    id: "",
    name: "",
    amount: 0,
    customerId: "",
    employeeId: "",
    paidAt: undefined,
    dueDate: undefined,
    financialCategoryId: "",
  });

  useEffect(() => {
    if (data) setPaymentList(data);

    handleGetFinancialCategory();

    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);

    if (recipientType === RecipientTypeEnum.EMPLOYEE) handleGetEmployee();

    if (recipientType === RecipientTypeEnum.CUSTOMER) handleGetCustomer();

    setLoading(false);
  }, [recipientType]);

  const handleGetFinancialCategory = async (): Promise<void> => {
    const { financialCategories } = await financialCategoryService.findAll({
      orderBy: { name: "asc" },
      where: { financialFlowType: FinancialFlowType.OUT },
    });

    const options = financialCategories.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    setOptionsFinancialCategory(options);
  };

  const handleGetEmployee = async (): Promise<void> => {
    const { employee } = await employeeService.findAll({
      orderBy: { name: "asc" },
    });

    const resultOptions = employee.map((item) => ({
      id: item.id ?? "",
      name: item.name,
    }));

    setOptionEmployee(resultOptions);
  };

  const handleGetCustomer = async (): Promise<void> => {
    const { customers } = await customerService.findAll({
      orderBy: { name: "asc" },
    });

    const resultOptions = customers.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    setOptionCustomer(resultOptions);
  };

  const handleSetPayment = (data: Partial<UpdatePaymentDto>): void => {
    setPaymentList((prev) => ({ ...prev, ...data }));
  };

  const handlerSetAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const amount = Number(parseMoneyToNumber(e.target.value));

    handleSetPayment({ amount });
  };

  const handleSetName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const name = e.target.value;

    handleSetPayment({ name });
  };

  const handleSetDueDate = (value: any): void => {
    const dueDate = new Date(value);

    handleSetPayment({ dueDate });
  };

  const handleSetPaidAt = (value: any): void => {
    const paidAt = new Date(value);

    handleSetPayment({ paidAt });
  };

  const hadleSelectOptionsFinancialCategory = (
    data: SelectOption | null,
  ): void => {
    handleSetPayment({
      ...paymentList,
      financialCategoryId: data?.id,
    });
  };

  const hadleSelectOptionsCustomer = (data: SelectOption | null): void => {
    handleSetPayment({
      ...paymentList,
      customerId: data?.id,
    });
  };

  const hadleSelectOptionsEmployee = (data: SelectOption | null): void => {
    handleSetPayment({
      ...paymentList,
      employeeId: data?.id,
    });
  };

  const handleUpsertReceivedCheck = (): void => {
    const { id, ...data } = paymentList;

    if (isEdit) {
      onEdit({ id, ...data });
      return;
    }

    onRegister({
      name: paymentList.name ?? "",
      amount: paymentList.amount ?? 0,
      customerId: paymentList.customerId ?? "",
      employeeId: paymentList.employeeId ?? "",
      paidAt: paymentList.paidAt ?? new Date(),
      referenceMonth: paymentList.referenceMonth,
      dueDate: paymentList.dueDate ?? new Date(),
      recurringPaymentId: paymentList.recurringPaymentId ?? "",
      financialCategoryId: paymentList.financialCategoryId ?? "",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col p-6 space-y-2 gap-4 ${showCalendar ? "min-h-175" : ""}`}
    >
      <h2 className="text-lg font-semibold">
        {isEdit ? "Atualizar pagamento" : "Registrar pagamento"}
      </h2>

      <Input
        className="flex-1"
        onChange={handleSetName}
        inputType={InputType.Text}
        value={paymentList.name}
        name={"Informe o motivo do pagamento"}
      />

      <Input
        onlyDay
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        value={paymentList.dueDate}
        onValueChange={handleSetDueDate}
        name={"Selecione a data de vencimento"}
        onCalendarVisibilityChange={setShowCalendar}
      />

      <Input
        onlyDay
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        value={paymentList.paidAt}
        onValueChange={handleSetPaidAt}
        name={"Selecione a data de pagamento"}
        onCalendarVisibilityChange={setShowCalendar}
      />

      <ComboBox
        valueKey="id"
        labelKey="name"
        selected={
          optionsFinancialCategory
            .filter(({ id }) => id === paymentList.financialCategoryId)
            .at(0)!
        }
        options={optionsFinancialCategory}
        name="Selecione a categoria financeira"
        onSelectOption={hadleSelectOptionsFinancialCategory}
      />

      <div className="flex flex-row w-full h-[0.25] bg-gray-300" />

      <ComboBoxIcon
        name="Destinatário do pagamento"
        description="Selecione quem está associado ao pagamento"
        icon={<UsersIcon />}
        value={recipientType}
        options={recipientOptions}
        onChange={(value) =>
          setRecipientType(RecipientTypeEnum[value as RecipientTypeEnum])
        }
      />

      {recipientType === RecipientTypeEnum.EMPLOYEE && (
        <ComboBox
          valueKey="id"
          labelKey="name"
          options={optionEmployee}
          name="Selecione o funcionário"
          onSelectOption={hadleSelectOptionsEmployee}
          selected={
            optionEmployee
              .filter(({ id }) => id === paymentList?.employeeId)
              .at(0)!
          }
        />
      )}

      {recipientType === RecipientTypeEnum.CUSTOMER && (
        <ComboBox
          valueKey="id"
          labelKey="name"
          options={optionCustomer}
          name="Selecione o cliente"
          onSelectOption={hadleSelectOptionsCustomer}
          selected={
            optionCustomer
              .filter(({ id }) => id === paymentList?.customerId)
              .at(0)!
          }
        />
      )}

      <Input
        type="number"
        className="flex-1"
        name={"Insira o valor"}
        value={paymentList?.amount}
        inputType={InputType.Number}
        onChange={handlerSetAmount}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          className={"px-4 py-2"}
          onClick={handleUpsertReceivedCheck}
          text={isEdit ? "Atualizar" : "Confirmar"}
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
