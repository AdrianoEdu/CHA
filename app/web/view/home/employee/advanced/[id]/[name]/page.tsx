// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import RegisterEmployeeAdvanceModal from "@/app/web/components/modal/employee-advance/employee-advance";
import Table from "@/app/web/components/table/table";
import {
  CreateEmployeeAdvanceDto,
  GetAllEmployeeAdvanceDto,
} from "@/app/web/dto/employee-advance.dto";
import {
  GetEmployeeVacation,
  CreateEmployeeVacation,
  PeriodEmployeeVacation,
} from "@/app/web/dto/emplpoyee-vacation-dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { employeeAdvanceService } from "@/app/web/services/employeeAdvanceService/employeeAdvanceService";
import { employeeVacationService } from "@/app/web/services/employeeVacationService/employeeVacationService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

let countEmployees = 0;
let oldEmployeeAdvanceList: GetAllEmployeeAdvanceDto[] = [];

const takeEmployees = 20;

type EmployeeTab = "advance" | "vacation";

const normalizeDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isValidDate = (date: Date): boolean =>
  date instanceof Date && !Number.isNaN(date.getTime());

const parseVacationDate = (value: Date | string): Date => {
  if (value instanceof Date) {
    return normalizeDate(value);
  }

  if (!value) return new Date(Number.NaN);

  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date(Number.NaN);
  }

  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return new Date(Number.NaN);
  }

  return parsedDate;
};

const formatDateInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";

  const parsedDate =
    date instanceof Date ? normalizeDate(date) : parseVacationDate(date);

  if (!isValidDate(parsedDate)) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateInput = (value: string): Date =>
  value ? parseVacationDate(value) : new Date(Number.NaN);

const getVacationPeriodDays = (
  startDate: Date | string,
  endDate: Date | string,
): number => {
  const start = parseVacationDate(startDate);
  const end = parseVacationDate(endDate);

  if (!isValidDate(start) || !isValidDate(end) || end < start) {
    return 0;
  }

  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
};

const getVacationDaysUsed = (
  period: PeriodEmployeeVacation,
  today: Date,
): number => {
  const startDate = parseVacationDate(period.begin);
  const endDate = parseVacationDate(period.end);

  if (!isValidDate(startDate) || !isValidDate(endDate)) return 0;

  const currentDate = normalizeDate(today);

  if (currentDate < startDate || endDate < startDate) return 0;

  return getVacationPeriodDays(
    startDate,
    currentDate > endDate ? endDate : currentDate,
  );
};

const getTotalVacationDaysUsed = (
  periods: PeriodEmployeeVacation[],
  today: Date,
): number =>
  periods.reduce(
    (total, period) => total + getVacationDaysUsed(period, today),
    0,
  );

const getVacationStatus = (
  period: PeriodEmployeeVacation,
  today: Date,
): "future" | "ongoing" | "completed" => {
  const startDate = parseVacationDate(period.begin);
  const endDate = parseVacationDate(period.end);

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return "future";
  }

  const currentDate = normalizeDate(today);

  if (currentDate < startDate) return "future";
  if (currentDate > endDate) return "completed";

  return "ongoing";
};

export default function EmployeeAdvanced() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<EmployeeTab>("advance");

  const [employeeAdvanceList, setEmployeeAdvancedList] = useState<
    GetAllEmployeeAdvanceDto[]
  >([]);

  const [vacation, setVacation] = useState<GetEmployeeVacation | null>(null);
  const [loadingVacations, setLoadingVacations] = useState(false);
  const [savingVacations, setSavingVacations] = useState(false);
  const [creatingVacation, setCreatingVacation] = useState(false);
  const [editingVacation, setEditingVacation] = useState(false);

  const [vacationPeriods, setVacationPeriods] = useState<
    PeriodEmployeeVacation[]
  >([]);

  const [acquisitionStart, setAcquisitionStart] = useState<Date>(
    new Date(Number.NaN),
  );

  const [acquisitionEnd, setAcquisitionEnd] = useState<Date>(
    new Date(Number.NaN),
  );

  const { id, name } = useParams();
  const { openModal, closeModal } = useModal();

  const employeeName = decodeURIComponent(name as string);
  const [today, setToday] = useState<Date>(() => normalizeDate(new Date()));

  const onHandleGetEmployeeVacations = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoadingVacations(true);

    try {
      const response = await employeeVacationService.getById({
        id: id as string,
      });

      if (!response) {
        setVacation(null);
        return;
      }

      const currentDate = normalizeDate(new Date());
      setToday(currentDate);
      const periods = response.periods ?? [];

      const lastCalculationDate = response.lastCalculationDate
        ? parseVacationDate(response.lastCalculationDate)
        : null;

      if (!lastCalculationDate || !isValidDate(lastCalculationDate)) {
        const todayUsedDays = periods.filter((period) => {
          const begin = parseVacationDate(period.begin);
          const end = parseVacationDate(period.end);

          return (
            isValidDate(begin) &&
            isValidDate(end) &&
            currentDate >= begin &&
            currentDate <= end
          );
        }).length;

        const remainingDays = Math.max(
          0,
          (response.remainingDays ?? 30) - todayUsedDays,
        );

        await employeeVacationService.patch({
          id: response.id,
          remainingDays,
          lastCalculationDate: currentDate,
        });

        setVacation({
          ...response,
          remainingDays,
          lastCalculationDate: currentDate,
        });

        return;
      }

      if (formatDateInput(lastCalculationDate) < formatDateInput(currentDate)) {
        const previousUsedDays = getTotalVacationDaysUsed(
          periods,
          lastCalculationDate,
        );

        const currentUsedDays = getTotalVacationDaysUsed(periods, currentDate);

        const daysToDeduct = Math.max(0, currentUsedDays - previousUsedDays);
        const remainingDays = Math.max(
          0,
          (response.remainingDays ?? 30) - daysToDeduct,
        );

        await employeeVacationService.patch({
          id: response.id,
          remainingDays,
          lastCalculationDate: currentDate,
        });

        setVacation({
          ...response,
          remainingDays,
          lastCalculationDate: currentDate,
        });

        return;
      }

      setVacation(response);
    } catch (error) {
      console.error("Erro ao buscar férias do funcionário:", error);
    } finally {
      setLoadingVacations(false);
    }
  }, [id]);

  const onHandleGetAllEmployeeAdvanced = async (
    page: number,
  ): Promise<void> => {
    const currentSkip = (page - 1) * takeEmployees;

    const { count, employeeAdvanced } = await employeeAdvanceService.findAll({
      all: true,
      skip: currentSkip,
      take: takeEmployees,
      orderBy: { createdAt: "desc" },
      include: { reason: { select: { name: true } } },
    });

    countEmployees = count;
    oldEmployeeAdvanceList = employeeAdvanced;
    setEmployeeAdvancedList(employeeAdvanced);
  };

  const handleFilterAdvanceReason = async (page: number) => {
    const currentSkip = (page - 1) * takeEmployees;

    await handleGenericFilter({
      filter,
      originalList: oldEmployeeAdvanceList,
      setList: setEmployeeAdvancedList,
      fetchFromApi: async (value) => {
        const parsed = Number(value);

        //@ts-ignore
        const filteredFields: Partial<GetAllEmployeeAdvanceDto> = Number.isNaN(
          parsed,
        )
          ? { reasonName: { value, mode: "insensitive" } }
          : { amount: parsed };

        const { count, employeeAdvanced } =
          await employeeAdvanceService.findAll({
            all: true,
            skip: currentSkip,
            take: takeEmployees,
            where: filteredFields,
          });

        countEmployees = count;

        return { count, data: employeeAdvanced };
      },
    });
  };

  useEffect(() => {
    if (activeTab !== "advance") return;

    if (filter) {
      handleFilterAdvanceReason(currentPage);
      return;
    }

    onHandleGetAllEmployeeAdvanced(currentPage);
  }, [currentPage, filter, activeTab]);

  useEffect(() => {
    if (activeTab !== "vacation") return;

    onHandleGetEmployeeVacations();
  }, [activeTab, onHandleGetEmployeeVacations]);

  const currentCountEmployees = useMemo(() => countEmployees, [countEmployees]);

  const onHandleRegisterEmployeeAdvanceModal = async ({
    amount,
    reasonId,
  }: CreateEmployeeAdvanceDto): Promise<void> => {
    await employeeAdvanceService.create({
      amount,
      reasonId,
      employeeId: id as string,
    });

    await onHandleGetAllEmployeeAdvanced(currentPage);
    closeModal();
  };

  const onHandleActionClick = (): void => {
    openModal(
      <RegisterEmployeeAdvanceModal
        onClose={closeModal}
        employeeId={id as string}
        employeeName={employeeName}
        onRegister={onHandleRegisterEmployeeAdvanceModal}
      />,
      "Registrar novo pedido",
    );
  };

  const onHandleCreateEmployeeVacation = async (): Promise<void> => {
    if (!isValidDate(acquisitionStart) || !isValidDate(acquisitionEnd)) {
      alert("Informe a data inicial e final do período aquisitivo.");
      return;
    }

    if (normalizeDate(acquisitionEnd) <= normalizeDate(acquisitionStart)) {
      alert("A data final deve ser posterior à data inicial.");
      return;
    }

    setCreatingVacation(true);

    try {
      const payload: CreateEmployeeVacation = {
        employeeId: id as string,
        acquisitionStart,
        acquisitionEnd,
      };

      await employeeVacationService.create(payload);
      await onHandleGetEmployeeVacations();

      setAcquisitionStart(new Date(Number.NaN));
      setAcquisitionEnd(new Date(Number.NaN));

      alert("Período aquisitivo cadastrado com sucesso.");
    } catch (error) {
      console.error("Erro ao cadastrar período aquisitivo:", error);
      alert("Não foi possível cadastrar o período aquisitivo.");
    } finally {
      setCreatingVacation(false);
    }
  };

  const totalRemainingDays = vacation?.remainingDays ?? 0;

  const totalUsedDays = useMemo(
    () => getTotalVacationDaysUsed(vacation?.periods ?? [], today),
    [vacation, today],
  );

  const hasDelayedVacations = totalRemainingDays > 30;

  const onHandleAddVacationPeriod = (): void => {
    if (!vacation) return;

    setVacationPeriods((current) => [
      ...current,
      {
        begin: new Date(Number.NaN),
        end: new Date(Number.NaN),
      },
    ]);
  };

  const onHandleRemoveVacationPeriod = (index: number): void => {
    setVacationPeriods((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const onHandleUpdateVacationPeriod = (
    index: number,
    field: keyof PeriodEmployeeVacation,
    value: Date,
  ): void => {
    setVacationPeriods((current) =>
      current.map((period, currentIndex) =>
        currentIndex === index ? { ...period, [field]: value } : period,
      ),
    );
  };

  const onHandleEditVacation = (): void => {
    if (!vacation) return;

    setVacationPeriods(
      (vacation.periods ?? []).map((period) => ({
        begin: parseVacationDate(period.begin),
        end: parseVacationDate(period.end),
      })),
    );

    setEditingVacation(true);
  };

  const onHandleCancelEdit = (): void => {
    setEditingVacation(false);
    setVacationPeriods([]);
  };

  const onHandleSaveVacations = async (): Promise<void> => {
    if (!vacation) {
      alert("Nenhum cadastro de férias encontrado.");
      return;
    }

    if (!vacationPeriods.length) {
      alert("Adicione pelo menos um período de férias.");
      return;
    }

    const hasInvalidPeriod = vacationPeriods.some((period) => {
      if (!isValidDate(period.begin) || !isValidDate(period.end)) {
        return true;
      }

      return normalizeDate(period.end) < normalizeDate(period.begin);
    });

    if (hasInvalidPeriod) {
      alert("Verifique as datas dos períodos de férias.");
      return;
    }

    const sortedPeriods = [...vacationPeriods].sort(
      (a, b) =>
        parseVacationDate(a.begin).getTime() -
        parseVacationDate(b.begin).getTime(),
    );

    for (let index = 1; index < sortedPeriods.length; index++) {
      const previousEnd = normalizeDate(
        parseVacationDate(sortedPeriods[index - 1].end),
      );

      const currentStart = normalizeDate(
        parseVacationDate(sortedPeriods[index].begin),
      );

      if (currentStart <= previousEnd) {
        alert("Existem períodos de férias sobrepostos.");
        return;
      }
    }

    const totalDays = sortedPeriods.reduce(
      (total, period) =>
        total + getVacationPeriodDays(period.begin, period.end),
      0,
    );

    if (totalDays > 30) {
      alert("Os períodos deste cadastro não podem ultrapassar 30 dias.");
      return;
    }

    setSavingVacations(true);

    try {
      const currentDate = normalizeDate(new Date());
      setToday(currentDate);

      const periodsToSave = sortedPeriods.map((period) => ({
        begin: normalizeDate(parseVacationDate(period.begin)),
        end: normalizeDate(parseVacationDate(period.end)),
      }));

      const parsedLastCalculationDate = vacation.lastCalculationDate
        ? parseVacationDate(vacation.lastCalculationDate)
        : null;

      let daysToDeduct = 0;

      if (
        !parsedLastCalculationDate ||
        !isValidDate(parsedLastCalculationDate)
      ) {
        const previousDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 1,
        );

        daysToDeduct =
          getTotalVacationDaysUsed(periodsToSave, currentDate) -
          getTotalVacationDaysUsed(periodsToSave, previousDate);
      } else if (
        formatDateInput(parsedLastCalculationDate) <
        formatDateInput(currentDate)
      ) {
        daysToDeduct =
          getTotalVacationDaysUsed(vacation.periods ?? [], currentDate) -
          getTotalVacationDaysUsed(
            vacation.periods ?? [],
            parsedLastCalculationDate,
          );
      }

      daysToDeduct = Math.max(0, daysToDeduct);

      const remainingDays = Math.max(
        0,
        (vacation.remainingDays ?? 30) - daysToDeduct,
      );

      await employeeVacationService.patch({
        id: vacation.id,
        periods: periodsToSave,
        remainingDays,
        lastCalculationDate: currentDate,
      });

      setVacation({
        ...vacation,
        periods: periodsToSave,
        remainingDays,
        lastCalculationDate: currentDate,
      });

      onHandleCancelEdit();

      alert("Períodos de férias atualizados com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar férias:", error);
      alert("Não foi possível atualizar os períodos de férias.");
    } finally {
      setSavingVacations(false);
    }
  };

  const onHandleTotalPeriodDays = (periods: PeriodEmployeeVacation[]): number =>
    periods.reduce(
      (total, period) =>
        total + getVacationPeriodDays(period.begin, period.end),
      0,
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <span className="text-gray-500">Funcionário selecionado:</span>
        <span className="text-2xl font-bold">{employeeName}</span>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("advance")}
          className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "advance"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Adiantamentos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vacation")}
          className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "vacation"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Férias
        </button>
      </div>

      {activeTab === "advance" && (
        <Table
          enableFilter
          take={takeEmployees}
          currentPage={currentPage}
          rows={employeeAdvanceList}
          onFilterChange={setFilter}
          title="Informações adicionais"
          countRows={currentCountEmployees}
          onActionClicked={onHandleActionClick}
          onPageChange={(page) => setCurrentPage(page)}
          columns={[
            { label: "Efetuado em", accessor: "createdAt" },
            { label: "Motivo", accessor: "reasonName" },
            {
              label: "Valor R$",
              accessor: "amount",
              render: (row) => Number(row.amount).toFixed(2),
            },
          ]}
        />
      )}

      {activeTab === "vacation" && (
        <div className="flex flex-col gap-6">
          {loadingVacations ? (
            <div className="flex justify-center py-12">
              <span className="text-sm text-gray-500">
                Carregando informações de férias...
              </span>
            </div>
          ) : !vacation ? (
            <div className="flex flex-col gap-5 rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">
                  Cadastrar período aquisitivo
                </h2>

                <p className="text-sm text-gray-500">
                  Este funcionário ainda não possui um período aquisitivo
                  cadastrado. Informe as datas para iniciar o controle de
                  férias.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data inicial
                  </label>

                  <input
                    type="date"
                    value={formatDateInput(acquisitionStart)}
                    onChange={(event) =>
                      setAcquisitionStart(parseDateInput(event.target.value))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data final
                  </label>

                  <input
                    type="date"
                    min={
                      isValidDate(acquisitionStart)
                        ? formatDateInput(acquisitionStart)
                        : undefined
                    }
                    value={formatDateInput(acquisitionEnd)}
                    onChange={(event) =>
                      setAcquisitionEnd(parseDateInput(event.target.value))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onHandleCreateEmployeeVacation}
                  disabled={creatingVacation}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingVacation
                    ? "Cadastrando..."
                    : "Cadastrar período aquisitivo"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">Controle de férias</h2>
                  <p className="text-sm text-gray-500">
                    Acompanhe o período aquisitivo e os dias disponíveis do
                    funcionário.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <span className="text-sm text-gray-500">
                      Dias restantes
                    </span>

                    <div
                      className={`mt-2 text-3xl font-bold ${
                        hasDelayedVacations ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {totalRemainingDays}
                    </div>

                    <span className="text-xs text-gray-500">
                      Dias disponíveis acumulados
                    </span>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <span className="text-sm text-gray-500">
                      Dias usufruídos
                    </span>

                    <div className="mt-2 text-3xl font-bold text-gray-800">
                      {totalUsedDays}
                    </div>

                    <span className="text-xs text-gray-500">
                      Conforme as datas cadastradas
                    </span>
                  </div>

                  <div
                    className={`rounded-lg border p-4 ${
                      hasDelayedVacations
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <span className="text-sm text-gray-500">Situação</span>

                    <div
                      className={`mt-2 text-lg font-bold ${
                        hasDelayedVacations ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {hasDelayedVacations
                        ? "Férias acumuladas"
                        : "Saldo normal"}
                    </div>

                    <span className="text-xs text-gray-500">
                      {hasDelayedVacations
                        ? `${totalRemainingDays - 30} dias acima de 30`
                        : "Até 30 dias disponíveis"}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 font-semibold">Período aquisitivo</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">
                        Data inicial
                      </span>

                      <span className="font-medium">
                        {formatDateInput(vacation.acquisitionStart)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Data final</span>

                      <span className="font-medium">
                        {formatDateInput(vacation.acquisitionEnd)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">
                      Períodos de férias
                    </h3>

                    <p className="text-sm text-gray-500">
                      Gerencie os períodos de descanso deste período aquisitivo.
                    </p>
                  </div>

                  {!editingVacation && (
                    <button
                      type="button"
                      onClick={onHandleEditVacation}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      Editar férias
                    </button>
                  )}
                </div>

                {editingVacation ? (
                  <div className="flex flex-col gap-4">
                    {vacationPeriods.map((period, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            Período de férias {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => onHandleRemoveVacationPeriod(index)}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-600">
                              Data inicial
                            </label>

                            <input
                              type="date"
                              value={formatDateInput(period.begin)}
                              onChange={(event) =>
                                onHandleUpdateVacationPeriod(
                                  index,
                                  "begin",
                                  parseDateInput(event.target.value),
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-600">
                              Data final
                            </label>

                            <input
                              type="date"
                              min={formatDateInput(period.begin) || undefined}
                              value={formatDateInput(period.end)}
                              onChange={(event) =>
                                onHandleUpdateVacationPeriod(
                                  index,
                                  "end",
                                  parseDateInput(event.target.value),
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <span className="text-xs text-gray-500">
                          {isValidDate(period.begin) && isValidDate(period.end)
                            ? `${getVacationPeriodDays(
                                period.begin,
                                period.end,
                              )} dias neste período`
                            : "Informe as duas datas"}
                        </span>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={onHandleAddVacationPeriod}
                      className="rounded-lg border border-dashed border-gray-300 p-3 text-sm font-medium text-blue-600 hover:bg-gray-50"
                    >
                      + Adicionar período de férias
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
                      <span className="text-sm font-semibold">
                        Total cadastrado:{" "}
                        {onHandleTotalPeriodDays(vacationPeriods)} dias
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={onHandleCancelEdit}
                          disabled={savingVacations}
                          className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-white disabled:opacity-50"
                        >
                          Cancelar
                        </button>

                        <button
                          type="button"
                          disabled={
                            savingVacations || vacationPeriods.length === 0
                          }
                          onClick={onHandleSaveVacations}
                          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {savingVacations
                            ? "Salvando..."
                            : "Salvar alterações"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(vacation.periods ?? []).length === 0 ? (
                      <div className="rounded-lg border border-gray-200 p-5">
                        <span className="text-base text-gray-500">
                          Nenhum período de férias cadastrado.
                        </span>
                      </div>
                    ) : (
                      (vacation.periods ?? []).map((period, index) => {
                        const days = getVacationPeriodDays(
                          period.begin,
                          period.end,
                        );

                        const status = getVacationStatus(period, today);
                        const usedDays = getVacationDaysUsed(period, today);

                        return (
                          <div
                            key={`${formatDateInput(period.begin)}-${formatDateInput(
                              period.end,
                            )}-${index}`}
                            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-gray-800">
                                Período {index + 1}
                              </span>

                              <span className="text-sm text-gray-500">
                                {formatDateInput(period.begin)} até{" "}
                                {formatDateInput(period.end)}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 sm:justify-end">
                              <div className="flex flex-col">
                                <span className="text-lg font-bold text-gray-800">
                                  {days} dias
                                </span>

                                <span className="text-xs text-gray-500">
                                  {usedDays} utilizados
                                </span>
                              </div>

                              <span
                                className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold ${
                                  status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "ongoing"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {status === "completed"
                                  ? "Concluído"
                                  : status === "ongoing"
                                    ? "Em andamento"
                                    : "Futuro"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
