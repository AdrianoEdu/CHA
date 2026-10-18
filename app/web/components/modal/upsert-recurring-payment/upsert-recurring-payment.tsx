// Copyright (c) 2026-04-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { ChangeEvent, JSX, useEffect, useState } from "react";
import Input, { InputType } from "../../input/input";
import Button, { ButtonStatusEnum } from "../../button/button";
import ComboBox from "../../combobox/combobox";
import {
  CreateRecurringPaymentDto,
  UpdateRecurringPaymentDto,
} from "@/app/web/dto/recurring-payment";
import { financialCategoryService } from "@/app/web/services/financialCategoryService/financialCategoryService";
import { FinancialFlowType, RecipientTypeEnum } from "@/app/web/constants/enum";
import { CalendarIcon, MoneyIcon, UsersIcon } from "@/app/web/icons";
import ComboBoxIcon, {
  ComboBoxIconOption,
} from "../../comboboxIcon/ComboboxIcon";
import CheckboxIcon from "../../comboboxIcon/checkbox-icon";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { customerService } from "@/app/web/services/customerService/customerService";

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

interface RecurringPaymentModalProps {
  data?: UpdateRecurringPaymentDto;
  onClose: () => void;
  onEdit: (data: UpdateRecurringPaymentDto) => void;
  onRegister: (data: CreateRecurringPaymentDto) => void;
}

type SelectOption = { id: string; name: string };

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

export default function UpsertRecurringPaymentkModal({
  data,
  onEdit,
  onClose,
  onRegister,
}: RecurringPaymentModalProps): JSX.Element {
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

  const [recurringPayment, setRecurrinPayment] =
    useState<UpdateRecurringPaymentDto>({
      id: "",
      dueDay: 0,
      fixedAmount: 0,
      isFixedAmount: false,
      isMonthly: false,
      name: "",
    });

  useEffect(() => {
    if (data) setRecurrinPayment(data);

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

  const handleSetRecurringPayment = (
    data: Partial<UpdateRecurringPaymentDto>,
  ): void => {
    setRecurrinPayment((prev) => ({ ...prev, ...data }));
  };

  const handlerSetFixedAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const fixedAmount = Number(parseMoneyToNumber(e.target.value));

    handleSetRecurringPayment({ fixedAmount });
  };

  const handleSetName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void => {
    const name = e.target.value;

    handleSetRecurringPayment({ name });
  };

  const handleSetDueDay = (value: any): void => {
    const dueDay = Number(value);

    handleSetRecurringPayment({ dueDay });
  };

  const handleSetIsMoth = (): void => {
    handleSetRecurringPayment({
      ...recurringPayment,
      isMonthly: !recurringPayment.isMonthly,
    });
  };

  const handleSetIsFixedAmount = (): void => {
    handleSetRecurringPayment({
      ...recurringPayment,
      isFixedAmount: !recurringPayment.isFixedAmount,
    });
  };

  const hadleSelectOptionsFinancialCategory = (
    data: SelectOption | null,
  ): void => {
    handleSetRecurringPayment({
      ...recurringPayment,
      financialCategoryId: data?.id,
    });
  };

  const hadleSelectOptionsCustomer = (data: SelectOption | null): void => {
    handleSetRecurringPayment({
      ...recurringPayment,
      customerId: data?.id,
    });
  };

  const hadleSelectOptionsEmployee = (data: SelectOption | null): void => {
    handleSetRecurringPayment({
      ...recurringPayment,
      employeeId: data?.id,
    });
  };

  const handleUpsertReceivedCheck = (): void => {
    const { id, ...data } = recurringPayment;

    if (isEdit) {
      onEdit({ id, ...data });
      return;
    }

    onRegister({
      name: recurringPayment.name ?? "",
      dueDay: recurringPayment.dueDay ?? 0,
      isMonthly: recurringPayment.isMonthly ?? false,
      fixedAmount: recurringPayment.fixedAmount ?? 0,
      isFixedAmount: recurringPayment.isFixedAmount ?? false,
      financialCategoryId: recurringPayment.financialCategoryId ?? "",
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
        {isEdit
          ? "Atualizar pagamento recorrente"
          : "Registrar pagamento recorrente"}
      </h2>

      <Input
        className="flex-1"
        onChange={handleSetName}
        inputType={InputType.Text}
        value={recurringPayment.name}
        name={"Informe o motivo do pagamento"}
      />

      <Input
        onlyDay
        className="flex-1"
        inputType={InputType.Date}
        showCalendar={showCalendar}
        value={recurringPayment.dueDay}
        onValueChange={handleSetDueDay}
        name={"Selecione o dia do pagamento"}
        onCalendarVisibilityChange={setShowCalendar}
      />

      <ComboBox
        valueKey="id"
        labelKey="name"
        selected={
          optionsFinancialCategory
            .filter(({ id }) => id === recurringPayment.financialCategoryId)
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
              .filter(({ id }) => id === recurringPayment?.employeeId)
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
              .filter(({ id }) => id === recurringPayment?.customerId)
              .at(0)!
          }
        />
      )}

      <div className="flex flex-col gap-3">
        <CheckboxIcon
          icon={<CalendarIcon />}
          title="Pagamento mensal"
          onChange={handleSetIsMoth}
          checked={recurringPayment.isMonthly ?? false}
          description="Gerar este pagamento automaticamente a cada mês."
        />

        <CheckboxIcon
          icon={<MoneyIcon />}
          title="Valor fixo"
          onChange={handleSetIsFixedAmount}
          checked={recurringPayment.isFixedAmount ?? false}
          description="Definir um valor previamente para este pagamento."
        />
      </div>

      {recurringPayment.isFixedAmount && (
        <Input
          type="number"
          className="flex-1"
          name={"Insira o valor"}
          inputType={InputType.Number}
          onChange={handlerSetFixedAmount}
          value={recurringPayment?.fixedAmount}
        />
      )}

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
