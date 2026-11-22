
 // Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { ChangeEvent, JSX, useEffect, useState } from "react";
import { FinancialFlowType, RecipientTypeEnum } from "@/app/web/constants/enum";
import { CreatePaymentDto, UpdatePaymentDto } from "@/app/web/dto/payment";
import { customerService } from "@/app/web/services/customerService/customerService";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { financialCategoryService } from "@/app/web/services/financialCategoryService/financialCategoryService";
import Input, { InputType } from "../../input/input";
import ComboBox from "../../combobox/combobox";
import { UsersIcon } from "@/app/web/icons";
import Button, { ButtonStatusEnum } from "../../button/button";
import ComboBoxIcon, { ComboBoxIconOption } from "../../ComboboxIcon/ComboboxIcon";

type SelectOption = {
  id: string;
  name: string;
};

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

  const normalizedValue = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const amount = Number(normalizedValue);

  return Number.isFinite(amount) ? amount : 0;
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
    () =>
      data?.customerId
        ? RecipientTypeEnum.CUSTOMER
        : RecipientTypeEnum.EMPLOYEE,
  );

  const [optionCustomer, setOptionCustomer] = useState<SelectOption[]>([]);
  const [optionEmployee, setOptionEmployee] = useState<SelectOption[]>([]);
  const [optionsFinancialCategory, setOptionsFinancialCategory] = useState<
    SelectOption[]
  >([]);

  const [paymentList, setPaymentList] = useState<UpdatePaymentDto>({
    id: data?.id ?? "",
    name: data?.name ?? "",
    amount: data?.amount ?? 0,
    customerId: data?.customerId ?? "",
    employeeId: data?.employeeId ?? "",
    paidAt: data?.paidAt,
    dueDate: data?.dueDate,
    financialCategoryId: data?.financialCategoryId ?? "",
    referenceMonth: data?.referenceMonth,
    recurringPaymentId: data?.recurringPaymentId,
  });

  useEffect(() => {
    const handleGetFinancialCategory = async (): Promise<void> => {
      const { financialCategories } =
        await financialCategoryService.findAll({
          orderBy: { name: "asc" },
          where: { financialFlowType: FinancialFlowType.OUT },
        });

      setOptionsFinancialCategory(
        financialCategories.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      );
    };

    handleGetFinancialCategory();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const handleGetRecipients = async (): Promise<void> => {
      setLoading(true);

      try {
        if (recipientType === RecipientTypeEnum.EMPLOYEE) {
          const { employee } = await employeeService.findAll({
            orderBy: { name: "asc" },
          });

          if (!isMounted) return;

          setOptionEmployee(
            employee.map((item) => ({
              id: item.id ?? "",
              name: item.name,
            })),
          );
        }

        if (recipientType === RecipientTypeEnum.CUSTOMER) {
          const { customers } = await customerService.findAll({
            orderBy: { name: "asc" },
          });

          if (!isMounted) return;

          setOptionCustomer(
            customers.map((item) => ({
              id: item.id,
              name: item.name,
            })),
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    handleGetRecipients();

    return () => {
      isMounted = false;
    };
  }, [recipientType]);

  const handleSetPayment = (value: Partial<UpdatePaymentDto>): void => {
    setPaymentList((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const handleSetAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    handleSetPayment({
      amount: parseMoneyToNumber(e.target.value),
    });
  };

  const handleSetName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    handleSetPayment({
      name: e.target.value,
    });
  };

  const handleSetDueDate = (value: Date | string | number): void => {
    handleSetPayment({
      dueDate: new Date(value)
    });
  };

  const handleSetPaidAt = (value: Date | string | number): void => {
    handleSetPayment({
      paidAt: new Date(value),
    });
  };

  const handleSelectFinancialCategory = (
    option?: SelectOption,
  ): void => {
    handleSetPayment({
      financialCategoryId: option?.id,
    });
  };

  const handleSelectCustomer = (option?: SelectOption): void => {
    handleSetPayment({
      customerId: option?.id,
    });
  };

  const handleSelectEmployee = (option?: SelectOption): void => {
    handleSetPayment({
      employeeId: option?.id,
    });
  };

  const handleUpsertPayment = (): void => {
    const { id, ...paymentData } = paymentList;

    if (isEdit) {
      onEdit({
        id,
        ...paymentData,
      });

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
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col p-6 space-y-2 gap-4 ${
        showCalendar ? "min-h-175" : ""
      }`}
    >
      <h2 className="text-lg font-semibold">
        {isEdit ? "Atualizar pagamento" : "Registrar pagamento"}
      </h2>

      <Input
        className="flex-1"
        onChange={handleSetName}
        inputType={InputType.Text}
        value={paymentList.name}
        name="Informe o motivo do pagamento"
      />

      <Input
        onlyDay
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        value={paymentList.dueDate}
        onValueChange={handleSetDueDate}
        name="Selecione a data de vencimento"
        onCalendarVisibilityChange={setShowCalendar}
      />

      <Input
        onlyDay
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        value={paymentList.paidAt}
        onValueChange={handleSetPaidAt}
        name="Selecione a data de pagamento"
        onCalendarVisibilityChange={setShowCalendar}
      />

      <ComboBox<SelectOption>
        valueKey="id"
        labelKey="name"
        selected={optionsFinancialCategory.find(
          ({ id }) => id === paymentList.financialCategoryId,
        )}
        options={optionsFinancialCategory}
        name="Selecione a categoria financeira"
        onSelectOption={handleSelectFinancialCategory}
      />

      <div className="flex flex-row w-full h-[0.25] bg-gray-300" />

      <ComboBoxIcon
        name="Destinatário do pagamento"
        description="Selecione quem está associado ao pagamento"
        icon={<UsersIcon />}
        value={recipientType}
        options={recipientOptions}
        onChange={(value) => setRecipientType(value as RecipientTypeEnum)}
      />

      {recipientType === RecipientTypeEnum.EMPLOYEE && (
        <ComboBox<SelectOption>
          valueKey="id"
          labelKey="name"
          options={optionEmployee}
          name="Selecione o funcionário"
          onSelectOption={handleSelectEmployee}
          selected={optionEmployee.find(
            ({ id }) => id === paymentList.employeeId,
          )}
        />
      )}

      {recipientType === RecipientTypeEnum.CUSTOMER && (
        <ComboBox<SelectOption>
          valueKey="id"
          labelKey="name"
          options={optionCustomer}
          name="Selecione o cliente"
          onSelectOption={handleSelectCustomer}
          selected={optionCustomer.find(
            ({ id }) => id === paymentList.customerId,
          )}
        />
      )}

      <Input
        type="number"
        className="flex-1"
        name="Insira o valor"
        value={paymentList.amount}
        inputType={InputType.Number}
        onChange={handleSetAmount}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          className="px-4 py-2"
          onClick={handleUpsertPayment}
          text={isEdit ? "Atualizar" : "Confirmar"}
          status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
        />
      </div>
    </div>
  );
}
