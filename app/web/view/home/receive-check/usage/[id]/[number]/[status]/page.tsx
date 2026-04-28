// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/page";
import { UpsertCheckUsageModal } from "@/app/web/components/modal/upsert-check-usage/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import {
  ActionEnum,
  CheckUsageType,
  ReceivedCheckStatus,
} from "@/app/web/constants/enum";
import {
  CheckUsageDTO,
  UpsertCheckUsageDTO,
} from "@/app/web/dto/check-usage.dto";
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

const statusCheckUsageMap: Record<CheckUsageType, string> = {
  DEPOSIT: "Depósito",
  PAYABLE: "Contas a pagar",
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
  {
    label: "Tipo de pagamento",
    accessor: "usageType",
    render: (row) => statusCheckUsageMap[row.usageType],
  },
  { label: "Anotações", accessor: "notes" },
  {
    label: "Valor utilizado",
    accessor: "amount",
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

  useEffect(() => {
    handleFilterCheckUsage;
  }, [filter]);

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
      where: { receivedCheck: { id: id as string } },
    });

    if (Array.isArray(result)) {
      setCheckUsageList(result);
      oldCheckUsageList = result;
    }
  };

  function handleOpenModalEditCheckUsage(row: CheckUsageDTO): void {
    openModal(
      <UpsertCheckUsageModal
        editData={row}
        onClose={closeModal}
        onSubmit={handleUpsertData}
        receivedCheckId={id as string}
      />,
      "Atualizar uso do cheque",
    );
  }

  const handleOpenModalRegisterCheckUsage = (): void => {
    openModal(
      <UpsertCheckUsageModal
        onClose={closeModal}
        onSubmit={handleUpsertData}
        receivedCheckId={id as string}
      />,
      "Recistrar uso do cheque",
    );
  };

  const handleUpsertData = (
    { id, ...data }: UpsertCheckUsageDTO,
    isEdit?: boolean,
  ): void => {
    const sum = (checkUsageSelected?.currentAmount ?? 0) + data.amount;

    if (sum > checkUsageSelected?.totalAmount!) {
      toast.error(
        "Erro na utilização, o valor ultrapassou o limite total do cheque",
      );
      return;
    }

    try {
      if (isEdit) {
        checkUsageService
          .update({
            id,
            receivedCheckId: data.receivedCheckId,
            amount: data.amount,
            notes: data.notes,
            usageType: data.usageType,
            usedAt: data.usedAt,
          })
          .then(() => {
            toast.success("Utilização do cheque atualizada com sucesso");
          });

        return;
      }

      checkUsageService.create({ ...data }).then(() => {
        toast.success("Utilização do cheque  com sucesso");
      });

      const sum = (checkUsageSelected?.currentAmount ?? 0) + data.amount;

      let validateStatus =
        sum === checkUsageSelected?.totalAmount
          ? ReceivedCheckStatus.FINALIZED
          : checkUsageSelected?.status;

      alert(validateStatus + `${sum} ${checkUsageSelected?.totalAmount}`);

      receiveCheckService.update({
        status: validateStatus,
        id: checkUsageSelected?.id ?? id,
        currentAmount: sum,
      });

      handleGetCheckUsageById();
      handleGetListCheckUsage();
      closeModal();
    } catch (err) {
      toast.error(`Erro no sistema: ${err}`);
    }
  };

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
          where: { usageType: value as CheckUsageType },
        });

        return Array.isArray(result) ? result : [result];
      },
    });
  };

  const handleSetFilterCheckUsage = (usageType: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const currentStatus = CheckUsageType[usageType as CheckUsageType];

    if (!currentStatus) {
      toast.error("Erro na pesquisa");
    }

    debounceRef.current = setTimeout(() => {
      setFilter(currentStatus);
    }, 500);
  };

  return (
    <div>
      <h1>{`Número do cheque: ${checkUsageSelected?.checkNumber}`}</h1>
      <h1>{`Status do cheque: ${statusMap[checkUsageSelected?.status!]}`}</h1>
      <h1>{`Valor total do cheque: R$ ${checkUsageSelected?.totalAmount.toFixed(2)}`}</h1>
      <h1>{`Valor total do cheque: R$ ${checkUsageSelected?.currentAmount.toFixed(2)}`}</h1>

      <Table
        enableFilter
        rows={checkUsageList}
        title={"Cheque utilizado"}
        onFilterChange={handleSetFilterCheckUsage}
        onActionClicked={handleOpenModalRegisterCheckUsage}
        columns={getColumns({ handleEdit: handleOpenModalEditCheckUsage })}
      />
    </div>
  );
}
