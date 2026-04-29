// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/page";
import { UpsertTransaction } from "@/app/web/components/modal/upsert-transaction/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import { FinancialFlowType } from "@/app/web/constants/enum";
import {
  GetTrasnactionDTO,
  UpsertTransactionDto,
} from "@/app/web/dto/transaction.dto";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { transactionService } from "@/app/web/services/transactionService/transactionService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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
  const [transactionList, setTansactionList] = useState<GetTrasnactionDTO[]>();

  const { closeModal, openModal } = useModal();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleGetListCheckUsage();
  }, []);

  useEffect(() => {
    handleFilterTransaction;
  }, [filter]);

  const handleGetListCheckUsage = async (): Promise<void> => {
    const result = await transactionService.findAll({
      skip: 0,
      take: 20,
      all: true,
      orderBy: { createdAt: "desc" },
    });

    if (Array.isArray(result)) {
      setTansactionList(result);
      oldTrancationList = result;
    }
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

        handleGetListCheckUsage();
        closeModal();
      });

      return;
    }

    transactionService.create({ ...data, currentAmount: 0 }).then(() => {
      toast.success("Transação registrada com sucesso");

      handleGetListCheckUsage();
      closeModal();
    });
  };

  const handleFilterTransaction = async () => {
    await handleGenericFilter({
      originalList: oldTrancationList,
      filter,
      setList: setTansactionList,
      getSearchField: (emp) => emp.id,
      fetchFromApi: async (value) => {
        const result = await transactionService.findAll({
          skip: 0,
          take: 20,
          all: true,
          orderBy: { created: "desc" },
          where: { category: { id: value } },
        });

        return Array.isArray(result) ? result : [result];
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
        rows={transactionList}
        onFilterChange={handleSetFilterTransaction}
        onActionClicked={handleOpenModalRegisterTransaction}
        columns={getColumns({ handleEdit: handleOpenModalEditTransaction })}
      />
    </div>
  );
}
