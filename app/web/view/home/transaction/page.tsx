// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/button";
import { UpsertTransaction } from "@/app/web/components/modal/upsert-transaction/upsert-transaction";
import Table, { TableColumn } from "@/app/web/components/table/table";
import { FinancialFlowType } from "@/app/web/constants/enum";
import {
  GetTrasnactionDTO,
  UpsertTransactionDto,
} from "@/app/web/dto/transaction.dto";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { transactionService } from "@/app/web/services/transactionService/transactionService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const takeTransaction = 20;

let countTransaction = 0;
let oldTrancationList: GetTrasnactionDTO[] = [];

export type GetColumnProps = {
  handleEdit: (row: GetTrasnactionDTO) => void;
};

const statusFinancialCategoryMap: Record<FinancialFlowType, string> = {
  IN: "Entrada",
  OUT: "Saida",
};

const getColumns = ({
  handleEdit,
}: GetColumnProps): TableColumn<GetTrasnactionDTO>[] => [
  { label: "Criado em", accessor: "createdAt" },
  {
    label: "Categoria Financeira",
    accessor: "category.name",
  },
  {
    label: "Tipo de categoria",
    accessor: "cateogry.financialFlowType",
    render: (row) =>
      statusFinancialCategoryMap[
        row.category.financialFlowType as FinancialFlowType
      ],
  },
  {
    label: "Cliente",
    accessor: "customer.name",
  },
  {
    label: "Valor",
    accessor: "amount",
    render: (row) => `R$ ${row.amount.toFixed(2)}`,
  },
  {
    label: "Data de vencimento",
    accessor: "dueDate",
  },
  {
    label: "Data do pagamento",
    accessor: "settledAt",
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
  const [transactionList, setTansactionList] = useState<GetTrasnactionDTO[]>();

  const { closeModal, openModal } = useModal();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (filter) handleFilterTransaction(currentPage);

    handleGetListCheckUsage(currentPage);
  }, [filter, currentPage]);

  const currentTransaction = useMemo(() => {
    return countTransaction;
  }, [countTransaction]);

  const handleGetListCheckUsage = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeTransaction;

    const { count, transactions } = await transactionService.findAll({
      all: true,
      skip: currentSkip,
      take: takeTransaction,
      orderBy: { createdAt: "desc" },
    });

    countTransaction = count;
    setTansactionList(transactions);
    oldTrancationList = transactions;
  };

  function handleOpenModalEditTransaction(row: GetTrasnactionDTO): void {
    openModal(
      <UpsertTransaction onClose={closeModal} onSubmit={handleUpsertData} />,
      "Atualizar Transação",
    );
  }

  const handleOpenModalRegisterTransaction = (): void => {
    openModal(
      <UpsertTransaction onClose={closeModal} onSubmit={handleUpsertData} />,
      "Registrar tansação",
    );
  };

  const handleUpsertData = (
    { id, ...data }: UpsertTransactionDto,

    isEdit?: boolean,
  ): void => {
    if (isEdit) {
      transactionService.update({ id, ...data }).then(() => {
        toast.success("Transação atualizada com sucesso");

        handleGetListCheckUsage(currentPage);
        closeModal();
      });

      return;
    }

    transactionService.create({ ...data, currentAmount: 0 }).then(() => {
      toast.success("Transação registrada com sucesso");

      handleGetListCheckUsage(currentPage);
      closeModal();
    });
  };

  const handleFilterTransaction = async (page: number) => {
    const currentSkip = (page - 1) * takeTransaction;

    await handleGenericFilter({
      originalList: oldTrancationList,
      filter,
      setList: setTansactionList,
      fetchFromApi: async (value) => {
        const { count, transactions } = await transactionService.findAll({
          all: true,
          skip: currentSkip,
          take: takeTransaction,
          orderBy: { created: "desc" },
          where: { category: { id: value } },
        });

        countTransaction = count;

        return { count, data: transactions };
      },
    });
  };

  const handleSetFilterTransaction = (usageType: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilter("");
    }, 500);
  };

  return (
    <div>
      <Table
        enableFilter
        title={"Transações"}
        take={takeTransaction}
        rows={transactionList}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        countRows={currentTransaction}
        onFilterChange={handleSetFilterTransaction}
        onActionClicked={handleOpenModalRegisterTransaction}
        columns={getColumns({ handleEdit: handleOpenModalEditTransaction })}
      />
    </div>
  );
}
