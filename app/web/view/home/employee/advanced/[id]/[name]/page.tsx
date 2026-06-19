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
import { useModal } from "@/app/web/providers/ModalProvider";
import { employeeAdvanceService } from "@/app/web/services/employeeAdvanceService/employeeAdvanceService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

let countEmployees = 0;
let oldEmployeeAdvanceList: GetAllEmployeeAdvanceDto[] = [];

const takeEmployees = 20;

export default function EmployeeAdvanced() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeAdvanceList, setEmployeeAdvancedList] = useState<
    GetAllEmployeeAdvanceDto[]
  >([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { id, name } = useParams();
  const { openModal, closeModal } = useModal();

  const employeeName = decodeURIComponent(name as string);

  useEffect(() => {
    if (filter) {
      handleFilterAdvanceReason(currentPage);
      return;
    }

    onHandleGetAllEmployeeAdvanced(currentPage);
  }, [currentPage, filter]);

  const currentCountEmployees = useMemo(() => {
    return countEmployees;
  }, [countEmployees]);

  const handleFilterAdvanceReason = async (page: number) => {
    const currentSkip = (page - 1) * takeEmployees;

    await handleGenericFilter({
      filter,
      originalList: oldEmployeeAdvanceList,
      setList: setEmployeeAdvancedList,
      fetchFromApi: async (value) => {
        const parsed = Number(value);

        // @ts-ignore
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

  const onHandleRegisterEmployeeAdvanceModal = async ({
    amount,
    employeeId,
    reasonId,
  }: CreateEmployeeAdvanceDto): Promise<void> => {
    await employeeAdvanceService
      .create({
        amount,
        reasonId,
        employeeId: id as string,
      })
      .then(() => {
        onHandleGetAllEmployeeAdvanced(currentPage);
        closeModal();
      });
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

  return (
    <div>
      <div className="flex flex-col">
        <span className="text-gray-500">Funcionário selecionado:</span>
        <span className="text-2xl font-bold">{employeeName}</span>
      </div>
      <Table
        enableFilter
        take={takeEmployees}
        currentPage={currentPage}
        rows={employeeAdvanceList}
        onFilterChange={setFilter}
        title={"Informações adicionais"}
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
    </div>
  );
}
