// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/page";
import UpsertReceivedCheckModal from "@/app/web/components/modal/upsert-received-check/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import { ActionEnum, ReceivedCheckStatus } from "@/app/web/constants/enum";
import {
  ReceivedCheckDTO,
  UpsertReceivedCheckDto,
} from "@/app/web/dto/receive-check.dto";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { receiveCheckService } from "@/app/web/services/receiveCheckService/receiveCheckService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldReceiveChecks: ReceivedCheckDTO[] = [];

type GetColumnsProps = {
  handleEdit: (row: ReceivedCheckDTO) => void;
};

const getColumns = ({
  handleEdit,
}: GetColumnsProps): TableColumn<ReceivedCheckDTO>[] => [
  { label: "Criado em", accessor: "createdAt" },
  { label: "Nome do cliente", accessor: "customer.name" },
  { label: "Banco", accessor: "bank.name" },
  { label: "Agência", accessor: "agency" },
  { label: "Cheque", accessor: "checkNumber" },
  { label: "Bom para", accessor: "goodForAt" },
  {
    label: "Valor",
    accessor: "totalAmount",
    render: (row) => `R$ ${row.totalAmount?.toFixed(2) ?? 0}`,
  },
  {
    label: "Status",
    accessor: "status",
    render: (row) => {
      const statusMap: Record<ReceivedCheckStatus, string> = {
        RECEIVED: "Recebido",
        IN_USE: "Em uso",
        FINALIZED: "Finalizado",
        CANCELLED: "Cancelado",
      };

      const colorMap: Record<ReceivedCheckStatus, string> = {
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
  {
    label: "Ações",
    isAction: true,
    render: (row) => {
      return (
        <div className="flex gap-2 justify-center">
          <Button
            icon={<EditIcon />}
            status={ButtonStatusEnum.UPDATE}
            onClick={(e) => {
              (e.stopPropagation(), handleEdit(row));
            }}
          />
        </div>
      );
    },
  },
];

export default function ReceiveCheck() {
  const [filter, setFilter] = useState("");
  const [receivedChecks, setReceivedChecks] = useState<ReceivedCheckDTO[]>();

  const router = useRouter();
  const { closeModal, openModal } = useModal();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleFindReceiveChecks();
  }, []);

  useEffect(() => {
    handleFilterReceiveCheck();
  }, [filter]);

  const handleUpserData = async (
    {
      id,
      bank,
      agency,
      status,
      bankId,
      customer,
      goodForAt,
      customerId,
      checkNumber,
      totalAmount,
      currentAmount,
    }: UpsertReceivedCheckDto,
    isEdit?: boolean,
  ): Promise<void> => {
    console.log(goodForAt);
    if (isEdit) {
      receiveCheckService
        .update({
          id,
          agency,
          bankId,
          status,
          goodForAt,
          customerId,
          checkNumber,
          totalAmount,
          currentAmount,
        })
        .then(() => {
          toast.success("Recebimento de cheque atualizado com sucesso");
          handleFindReceiveChecks();
        })
        .catch((err) => toast.error("Erro ao Atualizar cheque recebido", err));
      closeModal();
      return;
    }

    receiveCheckService
      .create({
        agency,
        bankId,
        checkNumber,
        customerId,
        totalAmount,
        goodForAt,
        currentAmount,
      })
      .then(() => {
        toast.success("Recebimento de cheque registrado com sucesso");
        handleFindReceiveChecks();
      })
      .catch((err) => toast.error("Erro ao cadastrar cheque recebido", err));

    closeModal();
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
      <UpsertReceivedCheckModal
        onClose={closeModal}
        onSubmit={handleUpserData}
      />,
    );
  };

  const handleFindReceiveChecks = async (): Promise<void> => {
    const result = await receiveCheckService.findAll({
      skip: 0,
      take: 20,
      all: true,
      orderBy: { createdAt: "desc" },
    });

    if (Array.isArray(result)) {
      oldReceiveChecks = result;
      setReceivedChecks(result);
    }
  };

  const handleFilterReceiveCheck = async () => {
    await handleGenericFilter({
      originalList: oldReceiveChecks,
      filter,
      setList: setReceivedChecks,
      getSearchField: (emp) => emp.checkNumber,
      fetchFromApi: async (value) => {
        const result = await receiveCheckService.findAll({
          skip: 0,
          take: 20,
          all: true,
          where: { code: value },
          orderBy: { createdAt: "desc" },
        });

        return Array.isArray(result) ? result : [result];
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

  const handleNavigateCheckUsageScreen = (row: ReceivedCheckDTO): void => {
    router.push(
      `/web/view/home/receive-check/usage/${row.id}/${row.checkNumber}/${row.status}`,
    );
  };

  return (
    <div>
      <Table
        enableFilter
        rows={receivedChecks}
        title={"Cheques recebidos"}
        onFilterChange={handleSetFilterCheckNumber}
        onRowClick={handleNavigateCheckUsageScreen}
        onActionClicked={hanleOpenModalRegisterReceivedCheck}
        columns={getColumns({ handleEdit: handleOpenModalEditReceivedCheck })}
      />
    </div>
  );
}
