// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/button";
import { UpsertCheckUsageModal } from "@/app/web/components/modal/upsert-check-usage/upsert-check-usage";
import Table, { TableColumn } from "@/app/web/components/table/table";
import {
  CheckUsageType,
  ReceivedCheckStatus,
  TransactionStatus,
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
import { transactionService } from "@/app/web/services/transactionService/transactionService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaLaptopHouse } from "react-icons/fa";
import { toast } from "react-toastify";

let countCheckUsage = 0;
const takeCheckUsage = 0;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [checkUsageSelected, setCheckUsageSelected] =
    useState<ReceivedCheckDTO>();
  const [checkUsageList, setCheckUsageList] = useState<CheckUsageDTO[]>();

  const { id, number, status } = useParams();
  const { closeModal, openModal } = useModal();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleReceivedCheckById();
  }, []);

  useEffect(() => {
    if (filter) {
      handleFilterCheckUsage(currentPage);
      return;
    }

    handleGetListCheckUsage(currentPage);
  }, [currentPage, filter]);

  const currentCountCheckUsage = useMemo(
    () => countCheckUsage,
    [countCheckUsage],
  );

  const handleReceivedCheckById = async (): Promise<void> => {
    const { receivedChecks } = await receiveCheckService.findAll({
      where: {
        id: id as string,
      },
      all: false,
    });

    setCheckUsageSelected(receivedChecks[0]);
  };

  const handleGetListCheckUsage = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeCheckUsage;

    const { checkUsages, count } = await checkUsageService.findAll({
      all: true,
      skip: currentSkip,
      take: takeCheckUsage,
      orderBy: { createdAt: "desc" },
      where: { receivedCheck: { id: id as string } },
    });

    countCheckUsage = count;
    setCheckUsageList(checkUsages);
    oldCheckUsageList = checkUsages;
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

  const handleUpsertData = async (
    { id, ...data }: UpsertCheckUsageDTO,
    isEdit?: boolean,
  ): Promise<void> => {
    const sum = (checkUsageSelected?.currentAmount ?? 0) + data.amount;

    const { transactions } = await transactionService.findAll({
      where: { id: data.transactionId },
      all: false,
    });

    const sumTransaction = data.amount + transactions[0].currentAmount;

    if (sumTransaction > transactions[0].amount) {
      toast.error(
        "Erro na utilização do cheque,  o valor não pode ultrapassar o valor total da conta a pagar",
      );
      return;
    }

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

      let validateStatusReceivedCheck =
        sum === checkUsageSelected?.totalAmount
          ? ReceivedCheckStatus.FINALIZED
          : checkUsageSelected?.status;

      let validateStatusTransaction =
        sumTransaction === transactions[0].amount
          ? TransactionStatus.FINALIZED
          : TransactionStatus.IN_USE;

      receiveCheckService.update({
        status: validateStatusReceivedCheck,
        id: checkUsageSelected?.id ?? id,
        currentAmount: sum,
      });

      await transactionService.update({
        id: data.transactionId,
        currentAmount: sumTransaction,
        status: validateStatusTransaction,

        ...(validateStatusTransaction === TransactionStatus.FINALIZED && {
          settledAt: new Date(),
        }),
      });

      handleReceivedCheckById();
      handleGetListCheckUsage(currentPage);
      closeModal();
    } catch (err) {
      toast.error(`Erro no sistema: ${err}`);
    }
  };

  const handleFilterCheckUsage = async (page: number) => {
    const currentSkip = (page - 1) * takeCheckUsage;

    await handleGenericFilter({
      filter,
      originalList: oldCheckUsageList,
      setList: setCheckUsageList,
      fetchFromApi: async (value) => {
        const parsed = Number(value);

        //@ts-ignore
        const filteredFields: Partial<CheckUsageDTO> = { usageType: value };

        const { count, checkUsages } = await checkUsageService.findAll({
          all: true,
          skip: currentSkip,
          take: takeCheckUsage,
          where: filteredFields,
          orderBy: { createdAt: "desc" },
        });

        countCheckUsage = count;

        return { count, data: checkUsages };
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
      <h1>{`Valor utilizado do cheque: R$ ${checkUsageSelected?.currentAmount.toFixed(2)}`}</h1>

      <Table
        enableFilter
        rows={checkUsageList}
        take={takeCheckUsage}
        filterType={"select"}
        filterOptions={[
          {
            label: "Depósito",
            value: CheckUsageType.DEPOSIT,
          },
          {
            label: "Contas a pagar",
            value: CheckUsageType.PAYABLE,
          },
        ]}
        currentPage={currentPage}
        title={"Cheque utilizado"}
        onPageChange={setCurrentPage}
        countRows={currentCountCheckUsage}
        onFilterChange={handleSetFilterCheckUsage}
        onActionClicked={handleOpenModalRegisterCheckUsage}
        columns={getColumns({ handleEdit: handleOpenModalEditCheckUsage })}
      />
    </div>
  );
}
