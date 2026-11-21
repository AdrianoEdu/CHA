// Copyright (c) 2026-11-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import {
  type ChangeEvent,
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Input, { InputType } from "../../input/input";
import Button, { ButtonStatusEnum } from "../../button/button";
import ComboBox from "../../combobox/combobox";

import {
  BusinessDayAdjustment,
  RecurringPaymentDateType,
} from "@/app/web/constants/enum";

import {
  type CreateRecurringPaymentDto,
  type UpdateRecurringPaymentDto,
} from "@/app/web/dto/recurring-payment";

import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { CalendarIcon, UsersIcon } from "@/app/web/icons";

interface RecurringPaymentModalProps {
  data?: UpdateRecurringPaymentDto;
  onClose: () => void;
  onEdit: (data: UpdateRecurringPaymentDto) => void;
  onRegister: (data: CreateRecurringPaymentDto) => void;
}

interface SelectOption {
  id: string;
  name: string;
}

interface RecurringPaymentFormData {
  id?: string;
  name: string;
  dueDateType: RecurringPaymentDateType;
  dueDay?: number;
  adjustment?: BusinessDayAdjustment;
  employeeId?: string;
}

const dueDateTypeOptions: SelectOption[] = [
  {
    id: RecurringPaymentDateType.FIXED_DAY,
    name: "Dia fixo do mês",
  },
  {
    id: RecurringPaymentDateType.FIFTH_BUSINESS_DAY,
    name: "Quinto dia útil",
  },
];

const adjustmentOptions: SelectOption[] = [
  {
    id: BusinessDayAdjustment.PREVIOUS,
    name: "Antecipar para o dia útil anterior",
  },
  {
    id: BusinessDayAdjustment.NEXT,
    name: "Adiar para o próximo dia útil",
  },
];

const initialFormData: RecurringPaymentFormData = {
  name: "",
  dueDateType: RecurringPaymentDateType.FIXED_DAY,
};

export default function UpsertRecurringPaymentModal({
  data,
  onEdit,
  onClose,
  onRegister,
}: RecurringPaymentModalProps): JSX.Element {
  const isEdit = Boolean(data?.id);

  const [isEmployee, setIsEmployee] = useState(Boolean(data?.employeeId));

  const [formData, setFormData] = useState<RecurringPaymentFormData>(() => {
    if (!data) {
      return initialFormData;
    }

    let dueDateType = data.dueDateType;

    if (dueDateType === RecurringPaymentDateType.EMPLOYEE_SALARY) {
      dueDateType = RecurringPaymentDateType.FIXED_DAY;
    }

    return {
      id: data.id,
      name: data.name,
      dueDateType,
      dueDay: data.dueDay ?? undefined,
      adjustment: data.adjustment ?? undefined,
      employeeId: data.employeeId ?? undefined,
    };
  });

  const [employees, setEmployees] = useState<SelectOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeLoadError, setEmployeeLoadError] = useState("");
  const [formError, setFormError] = useState("");

  const isFixedDay =
    formData.dueDateType === RecurringPaymentDateType.FIXED_DAY;

  const selectedEmployee = useMemo(() => {
    return employees.find((employee) => employee.id === formData.employeeId);
  }, [employees, formData.employeeId]);

  const selectedDueDateType = useMemo(() => {
    return dueDateTypeOptions.find(
      (option) => option.id === formData.dueDateType,
    );
  }, [formData.dueDateType]);

  const selectedAdjustment = useMemo(() => {
    return adjustmentOptions.find(
      (option) => option.id === formData.adjustment,
    );
  }, [formData.adjustment]);

  const updateFormData = useCallback(
    (values: Partial<RecurringPaymentFormData>): void => {
      setFormData((current) => ({
        ...current,
        ...values,
      }));
    },
    [],
  );

  const handleGetEmployees = useCallback(async (): Promise<void> => {
    setLoadingEmployees(true);
    setEmployeeLoadError("");

    try {
      const response = await employeeService.findAll({
        orderBy: {
          name: "asc",
        },
      });

      const options = response.employee.map((employee) => ({
        id: employee.id ?? "",
        name: employee.name,
      }));

      setEmployees(options);
    } catch {
      setEmployeeLoadError(
        "Não foi possível carregar os funcionários. Tente novamente.",
      );
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    if (!isEmployee) {
      return;
    }

    void handleGetEmployees();
  }, [isEmployee, handleGetEmployees]);

  const handleEmployeeToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked;

    setIsEmployee(checked);
    setFormError("");

    if (!checked) {
      updateFormData({
        employeeId: undefined,
      });
    }
  };

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    updateFormData({
      name: event.target.value,
    });

    setFormError("");
  };

  const handleDueDayChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;

    if (!value) {
      updateFormData({
        dueDay: undefined,
      });

      return;
    }

    updateFormData({
      dueDay: Number(value),
    });

    setFormError("");
  };

  const handleDueDateTypeChange = (option: SelectOption | null): void => {
    if (!option) {
      return;
    }

    updateFormData({
      dueDateType: option.id as RecurringPaymentDateType,
      dueDay: undefined,
      adjustment: undefined,
    });

    setFormError("");
  };

  const handleAdjustmentChange = (option: SelectOption | null): void => {
    if (!option) {
      updateFormData({
        adjustment: undefined,
      });

      return;
    }

    updateFormData({
      adjustment: option.id as BusinessDayAdjustment,
    });
  };

  const handleEmployeeChange = (option: SelectOption | null): void => {
    if (!option) {
      updateFormData({
        employeeId: undefined,
      });

      return;
    }

    updateFormData({
      employeeId: option.id,
    });

    setFormError("");
  };

  const handleSubmit = (): void => {
    const name = formData.name.trim();

    if (!name) {
      setFormError("Informe o nome da recorrência.");
      return;
    }

    if (isEmployee && !formData.employeeId) {
      setFormError("Selecione o funcionário.");
      return;
    }

    if (isFixedDay) {
      const dueDay = formData.dueDay;

      if (
        dueDay === undefined ||
        !Number.isInteger(dueDay) ||
        dueDay < 1 ||
        dueDay > 31
      ) {
        setFormError("Informe um dia de vencimento entre 1 e 31.");
        return;
      }
    }

    const payload: CreateRecurringPaymentDto = {
      name,
      dueDateType: formData.dueDateType,
    };

    if (isFixedDay && formData.dueDay !== undefined) {
      payload.dueDay = formData.dueDay;
    }

    if (isFixedDay && formData.adjustment !== undefined) {
      payload.adjustment = formData.adjustment;
    }

    if (isEmployee && formData.employeeId) {
      payload.employeeId = formData.employeeId;
    }

    if (isEdit && formData.id) {
      onEdit({
        id: formData.id,
        ...payload,
      });

      return;
    }

    onRegister(payload);
  };

  let title = "Registrar pagamento recorrente";
  let submitLabel = "Confirmar";
  let submitStatus = ButtonStatusEnum.CONFIRM;

  if (isEdit) {
    title = "Atualizar pagamento recorrente";
    submitLabel = "Atualizar";
    submitStatus = ButtonStatusEnum.UPDATE;
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

        <p className="text-sm text-gray-500">
          Cadastre uma regra para os pagamentos que serão gerados
          automaticamente.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          className="w-full"
          inputType={InputType.Text}
          name="Nome da recorrência"
          value={formData.name}
          onChange={handleNameChange}
        />

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
          <input
            type="checkbox"
            checked={isEmployee}
            onChange={handleEmployeeToggle}
            className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
          />

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <UsersIcon />
              Este pagamento é destinado a um funcionário?
            </span>

            <span className="text-sm text-gray-500">
              Marque esta opção para vincular a recorrência a um funcionário.
              Caso contrário, ela será uma despesa geral.
            </span>
          </div>
        </label>

        {isEmployee && (
          <div className="flex flex-col gap-2">
            <ComboBox
              valueKey="id"
              labelKey="name"
              options={employees}
              selected={selectedEmployee}
              name="Selecione o funcionário"
              onSelectOption={handleEmployeeChange}
            />

            {loadingEmployees && (
              <p className="text-sm text-gray-500">
                Carregando funcionários...
              </p>
            )}

            {employeeLoadError && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-red-600">{employeeLoadError}</p>

                <Button
                  text="Tentar novamente"
                  onClick={handleGetEmployees}
                  status={ButtonStatusEnum.UPDATE}
                />
              </div>
            )}
          </div>
        )}

        <ComboBox
          valueKey="id"
          labelKey="name"
          options={dueDateTypeOptions}
          selected={selectedDueDateType}
          name="Regra de vencimento"
          onSelectOption={handleDueDateTypeChange}
        />

        {isFixedDay && (
          <>
            <Input
              className="w-full"
              inputType={InputType.Number}
              name="Dia do vencimento"
              value={formData.dueDay ?? ""}
              onChange={handleDueDayChange}
            />

            <ComboBox
              valueKey="id"
              labelKey="name"
              options={adjustmentOptions}
              selected={selectedAdjustment}
              name="Quando o vencimento cair em dia não útil"
              onSelectOption={handleAdjustmentChange}
            />
          </>
        )}

        {formData.dueDateType ===
          RecurringPaymentDateType.FIFTH_BUSINESS_DAY && (
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <CalendarIcon />

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-800">
                Quinto dia útil
              </p>

              <p className="text-sm text-gray-500">
                O vencimento será calculado automaticamente com base no quinto
                dia útil de cada mês.
              </p>
            </div>
          </div>
        )}

        {formError && <p className="text-sm text-red-600">{formError}</p>}
      </div>

      <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
        <Button
          text="Cancelar"
          onClick={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          className="px-4 py-2"
          onClick={handleSubmit}
          text={submitLabel}
          status={submitStatus}
        />
      </div>
    </div>
  );
}
