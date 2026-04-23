// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import {
  ActionEnum,
  CheckUsageType,
  ReceivedCheckStatus,
} from "@/app/web/constants/enum";
import { CheckUsageDTO } from "@/app/web/dto/check-usage.dto";
import { ReceivedCheckDTO } from "@/app/web/dto/receive-check.dto";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { checkUsageService } from "@/app/web/services/checkUsageService/checkUsageService";
import { receiveCheckService } from "@/app/web/services/receiveCheckService/receiveCheckService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldCheckUsageList: CheckUsageDTO[] = [];

export type GetColumnProps = {
  handleEdit: (row: CheckUsageDTO) => void;
};

const statusMap: Record<ReceivedCheckStatus, string> = {
  RECEIVED: "Recebido",
  IN_USE: "Em uso",
  FINALIZED: "Finalizado",
  CANCELLED: "Cancelado",
};

const getColumns = ({
  handleEdit,
}: GetColumnProps): TableColumn<CheckUsageDTO>[] => [
  { label: "Criado em", accessor: "usedAt" },
  { label: "Tipo de pagamento", accessor: "usageType" },
  { label: "Anotações", accessor: "notes" },
  {
    label: "Valor",
    accessor: "totalAmount",
    render: (row) => `R$ ${row.amount.toFixed(2)}`,
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
  const [checkUsageSelected, setCheckUsageSelected] =
    useState<ReceivedCheckDTO>();
  const [checkUsageList, setCheckUsageList] = useState<CheckUsageDTO[]>();

  const { id, number, status } = useParams();
  const { closeModal, openModal } = useModal();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleGetCheckUsageById();
    handleGetListCheckUsage();
  }, []);

  useEffect(() => {}, [filter]);

  const handleGetCheckUsageById = async (): Promise<void> => {
    const data = await receiveCheckService.findAll({
      where: {
        id: id as string,
      },
      all: false,
    });

    if (!Array.isArray(data)) setCheckUsageSelected(data);
  };

  const handleGetListCheckUsage = async (): Promise<void> => {
    const result = await checkUsageService.findAll({
      skip: 0,
      take: 20,
      all: true,
      orderBy: { createdAt: "desc" },
    });

    if (Array.isArray(result)) {
      setCheckUsageList(result);
      oldCheckUsageList = result;
    }
  };

  function handleOpenModalEditCheckUsage(row: CheckUsageDTO): void {
    throw new Error("Function not implemented.");
  }

  function handleOpenModalRegisterCheckUsage(): void {
    throw new Error("Function not implemented.");
  }

  function handleOpenModalEditReceivedCheck(row: CheckUsageDTO): void {
    throw new Error("Function not implemented.");
  }

  const handleFilterCheckUsage = async () => {
    await handleGenericFilter({
      originalList: oldCheckUsageList,
      filter,
      setList: setCheckUsageList,
      getSearchField: (emp) => emp.usageType,
      fetchFromApi: async (value) => {
        const result = await checkUsageService.findAll({
          skip: 0,
          take: 20,
          all: true,
          orderBy: { created: "desc" },
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

  return (
    <div>
      <h1>{`Número do cheque: ${checkUsageSelected?.checkNumber}`}</h1>
      <h1>{`Status do cheque: ${statusMap[checkUsageSelected?.status!]}`}</h1>
      <Table
        enableFilter
        rows={checkUsageList}
        title={"Cheque utilizado"}
        onFilterChange={handleFilterCheckUsage}
        onActionClicked={handleOpenModalRegisterCheckUsage}
        columns={getColumns({ handleEdit: handleOpenModalEditCheckUsage })}
      />
    </div>
  );
}
