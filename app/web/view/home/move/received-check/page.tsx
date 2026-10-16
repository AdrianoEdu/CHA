// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/button";
import UpsertReceivedCheckModal from "@/app/web/components/modal/upsert-received-check/upsert-received-check";
import Table, { TableColumn } from "@/app/web/components/table/table";
import { ReceivedCheckStatus } from "@/app/web/constants/enum";
import {
  CreateReceivedCheckDTO,
  ReceivedCheckDTO,
  UpdateReceivedCheckDTO,
} from "@/app/web/dto/receive-check.dto";
import { DeleteIcon } from "@/app/web/icons";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { receiveCheckService } from "@/app/web/services/receiveCheckService/receiveCheckService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldReceiveChecks: ReceivedCheckDTO[] = [];

let countReceivedCheck = 0;
const takeReceivedCheck = 20;

type GetColumnsProps = {
  handleRemove: (id: string) => void;
  handleEdit: (row: ReceivedCheckDTO) => void;
};

const getColumns = ({
  handleEdit,
  handleRemove,
}: GetColumnsProps): TableColumn<ReceivedCheckDTO>[] => [
  { label: "Criado em", accessor: "createdAt" },
  { label: "Nome do cliente", accessor: "customer.name" },
  { label: "Banco", accessor: "bank.name" },
  {
    label: "Agência",
    accessor: "agency",
    render(row) {
      return row.agency;
    },
  },
  { label: "Cheque", accessor: "checkNumber" },
  { label: "Bom para", accessor: "goodForAt" },
  {
    label: "Valor",
    accessor: "amount",
    render: (row) => `R$ ${row.amount?.toFixed(2) ?? 0}`,
  },
  {
    label: "Status",
    accessor: "status",
    render: (row) => {
      const statusMap: Record<ReceivedCheckStatus, string> = {
        RECEIVED: "Recebido",
        FINALIZED: "Finalizado",
        CANCELLED: "Cancelado",
      };

      const colorMap: Record<ReceivedCheckStatus, string> = {
        RECEIVED: "bg-green-100 text-green-800",
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
          {row.status !== ReceivedCheckStatus.CANCELLED && (
            <Button
              icon={<EditIcon />}
              status={ButtonStatusEnum.UPDATE}
              onClick={(e) => {
                (e.stopPropagation(), handleEdit(row));
              }}
            />
          )}
          {row.status !== ReceivedCheckStatus.CANCELLED &&
            row.status !== ReceivedCheckStatus.FINALIZED && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(row.id);
                }}
                icon={<DeleteIcon />}
                status={ButtonStatusEnum.CANCEL}
              />
            )}{" "}
        </div>
      );
    },
  },
];

export default function ReceiveCheck() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [receivedCheckList, setReceivedCheckList] =
    useState<ReceivedCheckDTO[]>();

  const { closeModal, openModal } = useModal();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (filter) {
      handleFilterReceivedCheck(currentPage);
      return;
    }

    handleGetAllReceivedChecks(currentPage);
  }, [filter, currentPage]);

  const currentCountReceivedChecks = useMemo(() => {
    return countReceivedCheck;
  }, [countReceivedCheck]);

  const handleOpenModal = (item?: ReceivedCheckDTO): void => {
    const data = item
      ? {
          id: item.id ?? "",
          notes: item.notes,
          agency: item.agency,
          paidAt: item.paidAt,
          status: item.status,
          bankId: item.bank?.id,
          amount: item.amount ?? 0,
          goodForAt: item.goodForAt,
          customerId: item.customer?.id,
          checkNumber: item.checkNumber,
        }
      : undefined;

    openModal(
      <UpsertReceivedCheckModal
        data={data}
        onClose={closeModal}
        onEdit={handleOnUpdate}
        onRegister={handleOnRegister}
      />,
    );
  };

  const handleOnRegister = async (
    data: CreateReceivedCheckDTO,
  ): Promise<void> => {
    try {
      await receiveCheckService.create(data);
      await resetPagination();
      toast.success("Cheque registrado com sucesso");
    } catch (err) {
      toast.error("Error ao registar o cheque");
    }
  };

  const handleOnUpdate = async (
    data: UpdateReceivedCheckDTO,
  ): Promise<void> => {
    try {
      await receiveCheckService.update(data);
      await resetPagination();
      toast.success("Cheque atualizado com sucesso");
    } catch (err) {
      toast.error("Error ao atualizar o cheque");
    }
  };

  const handleOnRemove = async (id: string): Promise<void> => {
    try {
      await receiveCheckService.remove(id);

      toast.success("Cheque recebido cancelado com sucesso");

      resetPagination();
    } catch (err) {
      toast.error("Erro ao cancelar cheque");
    }
  };

  const resetPagination = async (): Promise<void> => {
    closeModal();
    setCurrentPage(1);
    await handleGetAllReceivedChecks(1);
  };

  const handleFilterReceivedCheck = async (currentPage: number) => {
    const currentSkip = (currentPage - 1) * takeReceivedCheck;

    await handleGenericFilter({
      filter,
      setList: setReceivedCheckList,
      originalList: oldReceiveChecks,
      fetchFromApi: async (value) => {
        const checkNumber = Number(value);

        const { count, receivedChecks } = await receiveCheckService.findAll({
          skip: currentSkip,
          where: { checkNumber },
          take: takeReceivedCheck,
        });

        countReceivedCheck = count;

        return { count, data: receivedChecks };
      },
    });
  };

  const handleFilterReceivedCheckTable = (dataFilter: string): void => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (dataFilter === "") setCurrentPage(1);

      setFilter(dataFilter);
    }, 500);
  };

  const handleGetAllReceivedChecks = async (
    currentPage: number,
  ): Promise<void> => {
    const currentSkip = (currentPage - 1) * takeReceivedCheck;

    const { count, receivedChecks } = await receiveCheckService.findAll({
      all: true,
      skip: currentSkip,
      take: takeReceivedCheck,
      orderBy: { name: "asc" },
    });

    countReceivedCheck = count;
    setReceivedCheckList(receivedChecks);
    oldReceiveChecks = receivedChecks;
  };

  return (
    <div>
      <Table
        enableFilter
        rows={receivedCheckList}
        take={takeReceivedCheck}
        currentPage={currentPage}
        title={"Cheques recebidos"}
        onPageChange={setCurrentPage}
        onActionClicked={() => handleOpenModal()}
        countRows={currentCountReceivedChecks}
        onFilterChange={handleFilterReceivedCheckTable}
        columns={getColumns({
          handleEdit: handleOpenModal,
          handleRemove: handleOnRemove,
        })}
      />
    </div>
  );
}
