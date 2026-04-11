// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import UpsertReceivedCheckModal from "@/app/web/components/modal/upsert-received-check/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import {
  ReceivedCheckDTO,
  UpsertReceivedCheckDto,
} from "@/app/web/dto/receive-check.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { receiveCheckService } from "@/app/web/services/receiveCheckService/receiveCheckService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldReceiveChecks: ReceivedCheckDTO[] = [];

const getColumns = (): TableColumn<ReceivedCheckDTO>[] => [
  { label: "Criado em", accessor: "createdAt" },
  { label: "Nome do cliente", accessor: "customerName" },
  { label: "Banco", accessor: "bankName" },
  { label: "Agência", accessor: "agency" },
  { label: "Cheque", accessor: "checkNumber" },
  {
    label: "Valor",
    accessor: "totalAmount",
    render: (row) => `R$ ${row.totalAmount.toFixed(2)}`,
  },
  {
    label: "Status",
    accessor: "status",
    render: (row) => {
      const statusMap: Record<string, string> = {
        RECEIVED: "Recebido",
        IN_USE: "Em uso",
        FINALIZED: "Finalizado",
        CANCELLED: "Cancelado",
      };

      const colorMap: Record<string, string> = {
        RECEIVED: "bg-green-100 text-green-800",
        IN_USE: "bg-yellow-100 text-yellow-800",
        FINALIZED: "bg-blue-100 text-blue-800",
        CANCELLED: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            colorMap[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusMap[row.status] || row.status}
        </span>
      );
    },
  },
];

export default function ReceiveCheck() {
  const [filter, setFilter] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [receivedChecks, setReceivedChecks] = useState<ReceivedCheckDTO[]>();

  const { closeModal, openModal } = useModal();

  useEffect(() => {
    handleFindReceiveChecks();
  }, []);

  useEffect(() => {
    handleFilterReceiveCheck();
  }, [filter]);

  const handleUpserData = async (
    data: UpsertReceivedCheckDto,
    isEdit?: boolean,
  ): Promise<void> => {
    const { id, ...check } = data;

    if (isEdit)
      receiveCheckService.patch({ ...check, id }).then(() => {
        toast.success("Recebimento de cheque atualizado com sucesso");
      });

    receiveCheckService.create({ ...check }).then(() => {
      toast.success("Recebimento de cheque registrado com sucesso");
    });
  };

  const handleOpenModalEditReceivedCheck = (row: ReceivedCheckDTO): void => {
    openModal(
      <UpsertReceivedCheckModal
        isEdit
        editData={row}
        onClose={closeModal}
        onSubmit={handleUpserData}
      />,
    );
  };

  const hanleOpenModalRegisterReceivedCheck = (): void => {
    openModal(
      <UpsertReceivedCheckModal onClose={closeModal} onSubmit={() => {}} />,
    );
  };

  const handleFindReceiveChecks = async (): Promise<void> => {
    const result = await receiveCheckService.findAll({
      skip: 0,
      take: 20,
      type: ActionEnum.FindAll,
    });

    oldReceiveChecks = result;
    setReceivedChecks(result);
  };

  const handleFilterReceiveCheck = async () => {
    await handleGenericFilter({
      originalList: oldReceiveChecks,
      filter,
      setList: setReceivedChecks,
      getSearchField: (emp) => emp.checkNumber,
      fetchFromApi: async (value) => {
        return receiveCheckService.findByCheckNumber({
          checkNumber: value,
          type: ActionEnum.FindByFilters,
        });
      },
    });
  };

  const handleSetFilterCheckNumber = (checkNumber: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilter(checkNumber);
    }, 500);
  };

  return (
    <div>
      <Table
        enableFilter
        rows={receivedChecks}
        columns={getColumns()}
        title={"Cheques recebidos"}
        onFilterChange={handleSetFilterCheckNumber}
        onRowClick={handleOpenModalEditReceivedCheck}
        onActionClicked={hanleOpenModalRegisterReceivedCheck}
      />
    </div>
  );
}
