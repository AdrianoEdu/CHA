// Copyright (c) 2026-10-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/button";
import UpsertRecurringPaymentkModal from "@/app/web/components/modal/upsert-recurring-payment/upsert-recurring-payment";
import Table, { TableColumn } from "@/app/web/components/table/table";
import {
  CreateRecurringPaymentDto,
  GetRecurringPaymentDto,
  UpdateRecurringPaymentDto,
} from "@/app/web/dto/recurring-payment";
import { DeleteIcon } from "@/app/web/icons";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { recurringPaymentService } from "@/app/web/services/recurringPaymentService/recurringPaymentService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldRecurringPayment: GetRecurringPaymentDto[] = [];

let countRecurringPayment = 0;
const takeRecurringPayment = 20;

type GetColumnsProps = {
  handleRemove: (id: string) => void;
  handleEdit: (row: GetRecurringPaymentDto) => void;
};

const getColumns = ({
  handleEdit,
  handleRemove,
}: GetColumnsProps): TableColumn<GetRecurringPaymentDto>[] => [
  { label: "Criado em", accessor: "createdAt" },
  { label: "Nome", accessor: "name" },
  {
    label: "Pagamento recorretne?",
    accessor: "isFixedAmount",
    render(row) {
      return row.isMonthly ? "Sim" : "Não";
    },
  },
  {
    label: "Valor Fixo?",
    accessor: "isFixedAmount",
    render(row) {
      return row.isFixedAmount ? "Sim" : "Não";
    },
  },
  {
    label: "Valor",
    accessor: "fixedAmount",
    render: (row) => `R$ ${row.fixedAmount?.toFixed(2) ?? 0}`,
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
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(row.id);
            }}
            icon={<DeleteIcon />}
            status={ButtonStatusEnum.CANCEL}
          />
        </div>
      );
    },
  },
];

export default function ReceiveCheck() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recurringPaymentList, setRecurringPaymentList] =
    useState<GetRecurringPaymentDto[]>();

  const { closeModal, openModal } = useModal();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (filter) {
      handleFilterRecurringPayment(currentPage);
      return;
    }

    handleGetAllRecurringPayment(currentPage);
  }, [filter, currentPage]);

  const currentCountRecurringPayment = useMemo(() => {
    return countRecurringPayment;
  }, [countRecurringPayment]);

  const handleOpenModal = (item?: GetRecurringPaymentDto): void => {
    const data = item
      ? {
          id: item.id ?? "",
          createdAt: item.createdAt,
          fixedAmount: item.fixedAmount,
          isFixedAmount: item.isFixedAmount,
          isMonthly: item.isMonthly,
          name: item.name,
          updatedAt: item.updatedAt,
        }
      : undefined;

    openModal(
      <UpsertRecurringPaymentkModal
        data={data}
        onClose={closeModal}
        onEdit={handleOnUpdate}
        onRegister={handleOnRegister}
      />,
    );
  };

  const handleOnRegister = async (
    data: CreateRecurringPaymentDto,
  ): Promise<void> => {
    try {
      await recurringPaymentService.create(data);
      await resetPagination();
      toast.success("Pagamento recorrente registrado com sucesso");
    } catch (err) {
      toast.error("Error ao registar o pagamento recorrente");
    }
  };

  const handleOnUpdate = async (
    data: UpdateRecurringPaymentDto,
  ): Promise<void> => {
    try {
      await recurringPaymentService.update(data);
      await resetPagination();
      toast.success("Pagamento recorrente atualizado com sucesso");
    } catch (err) {
      toast.error("Error ao atualizar o pagamento recorrente");
    }
  };

  const handleOnRemove = async (id: string): Promise<void> => {
    try {
      await recurringPaymentService.remove(id);

      toast.success("Pagamento recorrente removido com sucesso");

      resetPagination();
    } catch (err) {
      toast.error("Erro ao remover o pgamento recorrente");
    }
  };

  const resetPagination = async (): Promise<void> => {
    closeModal();
    setCurrentPage(1);
    await handleGetAllRecurringPayment(1);
  };

  const handleFilterRecurringPayment = async (currentPage: number) => {
    const currentSkip = (currentPage - 1) * takeRecurringPayment;

    await handleGenericFilter({
      filter,
      setList: setRecurringPaymentList,
      originalList: oldRecurringPayment,
      fetchFromApi: async (value) => {
        const { count, recurringPayment } =
          await recurringPaymentService.findAll({
            skip: currentSkip,
            where: { name: value },
            take: takeRecurringPayment,
          });

        countRecurringPayment = count;

        return { count, data: recurringPayment };
      },
    });
  };

  const handleFilterRecurringPaymentTable = (dataFilter: string): void => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (dataFilter === "") setCurrentPage(1);

      setFilter(dataFilter);
    }, 500);
  };

  const handleGetAllRecurringPayment = async (
    currentPage: number,
  ): Promise<void> => {
    const currentSkip = (currentPage - 1) * takeRecurringPayment;

    const { count, recurringPayment } = await recurringPaymentService.findAll({
      all: true,
      skip: currentSkip,
      take: takeRecurringPayment,
      orderBy: { name: "asc" },
    });

    countRecurringPayment = count;
    setRecurringPaymentList(recurringPayment);
    oldRecurringPayment = recurringPayment;
  };

  return (
    <div>
      <Table
        enableFilter
        rows={recurringPaymentList}
        take={takeRecurringPayment}
        currentPage={currentPage}
        title={"Pagamentos recorrentes"}
        onPageChange={setCurrentPage}
        onActionClicked={() => handleOpenModal()}
        countRows={currentCountRecurringPayment}
        onFilterChange={handleFilterRecurringPaymentTable}
        columns={getColumns({
          handleEdit: handleOpenModal,
          handleRemove: handleOnRemove,
        })}
      />
    </div>
  );
}
