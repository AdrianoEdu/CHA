// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import RegisterEmployeeAdvanceModal from "@/app/web/components/modal/employee-advance/page";
import Table from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import { GetAllEmployeeAdvanceDto } from "@/app/web/dto/employee-advance.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { employeeAdvanceService } from "@/app/web/services/employeeAdvanceService/employeeAdvanceService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

let oldEmployeeAdvanceList: GetAllEmployeeAdvanceDto[] = [];

export default function EmployeeAdvanced() {
  const [filter, setFilter] = useState("");
  const [employeeAdvanceList, setEmployeeAdvancedList] = useState<
    GetAllEmployeeAdvanceDto[]
  >([]);

  const { id, name } = useParams();
  const { openModal, closeModal } = useModal();

  const employeeName = decodeURIComponent(name as string);

  useEffect(() => {
    onHandleGetAllEmployeeAdvanced();
  }, []);

  useEffect(() => {
    handleFilterAdvanceReason();
  }, [filter]);

  const handleFilterAdvanceReason = async () => {
    await handleGenericFilter({
      originalList: oldEmployeeAdvanceList,
      filter,
      setList: setEmployeeAdvancedList,
      getSearchField: (emp) => emp.reasonName,
      fetchFromApi: async (value) => {
        return employeeAdvanceService.findByName({
          reasonName: value,
          type: ActionEnum.FindByFilters,
        });
      },
    });
  };

  const onHandleGetAllEmployeeAdvanced = async (): Promise<void> => {
    const result = await employeeAdvanceService.findAll({
      skip: 0,
      take: 20,
      type: ActionEnum.FindAll,
    });

    oldEmployeeAdvanceList = result;
    setEmployeeAdvancedList(result);
  };

  const onHandleRegisterEmployeeAdvanceModal = async (
    reasonId: string,
    amount: number,
  ): Promise<void> => {
    await employeeAdvanceService
      .create({
        amount,
        reasonId,
        employeeId: id as string,
      })
      .then(() => {
        onHandleGetAllEmployeeAdvanced();
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
        rows={employeeAdvanceList}
        onFilterChange={setFilter}
        title="Informações adicionais"
        onActionClicked={onHandleActionClick}
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
