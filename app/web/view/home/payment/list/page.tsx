// Copyright (c) 2026-10-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button, { ButtonStatusEnum } from "@/app/web/components/button/button";
import UpsertPaymentModal from "@/app/web/components/modal/upsert-payment/upsert-payment";
import Table, { TableColumn } from "@/app/web/components/table/table";
import {
  CreatePaymentDto,
  GetPaymentDto,
  UpdatePaymentDto,
} from "@/app/web/dto/payment";
import { DeleteIcon } from "@/app/web/icons";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { paymentService } from "@/app/web/services/paymentService/paymentService";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldPayment: GetPaymentDto[] = [];

let countPayment = 0;
const takePayment = 20;

type GetColumnsProps = {
  handleRemove: (id: string) => void;
  handleEdit: (row: GetPaymentDto) => void;
};

const getColumns = ({
  handleEdit,
  handleRemove,
}: GetColumnsProps): TableColumn<GetPaymentDto>[] => [
  { label: "Criado em", accessor: "createdAt" },
  { label: "Nome", accessor: "name" },
  { label: "Data de vencimento", accessor: "dueDate" },
  { label: "Valor", accessor: "amount" },
  { label: "Data de pagamento", accessor: "paidAt" },
  {
    label: "Destinatário",
    render(row) {
      if (row.employee) return row.employee.name;
      if (row.customer) return row.customer.name;
    },
  },
  {
    label: "Status",
    render(row) {
      const isPaid = Boolean(row.paidAt);
      const isOverdue = !isPaid && new Date().getTime() > row.dueDate.getTime();

      const colorStatus = isPaid
        ? "bg-green-100 text-green-800"
        : isOverdue
          ? "bg-red-100 text-red-800"
          : "bg-blue-100 text-blue-800";

      const textStatus = isPaid ? "Pago" : isOverdue ? "Atrasado" : "Em dia";

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${colorStatus}`}
        >
          {textStatus}
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

export default function PaymentList() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentList, setPaymentList] = useState<GetPaymentDto[]>();

  const { closeModal, openModal } = useModal();

  useEffect(() => {
    if (filter) {
      handleFilterPayment(currentPage);
      return;
    }

    handleGetAllPayment(currentPage);
  }, [filter, currentPage]);

  const currentCountPayment = useMemo(() => {
    return countPayment;
  }, [countPayment]);

  const monthFilterOptions = useMemo(() => {
    const options = [{ label: "Selecione o mês", value: "" }];
    const year = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);

      options.push({
        label: date.toLocaleDateString("pt-BR", {
          month: "long",
        }),
        value: `${year}-${String(month + 1).padStart(2, "0")}`,
      });
    }

    return options;
  }, []);

  const handleOpenModal = (item?: GetPaymentDto): void => {
    const data = item
      ? {
          id: item.id ?? "",
          amount: item.amount,
          name: item.name ?? "",
          dueDate: item.dueDate,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          paidAt: item.paidAt ?? undefined,
          employeeId: item.employee?.id ?? undefined,
          customerId: item.customer?.id ?? undefined,
          financialCategoryId: item.financialCategory.id,
          referenceMonth: item.referenceMonth ?? undefined,
          recurringPaymentId: item.recurringPayment?.id ?? undefined,
        }
      : undefined;

    openModal(
      <UpsertPaymentModal
        data={data}
        onClose={closeModal}
        onEdit={handleOnUpdate}
        onRegister={handleOnRegister}
      />,
    );
  };

  const handleOnRegister = async (data: CreatePaymentDto): Promise<void> => {
    try {
      await paymentService.create(data);
      await resetPagination();
      toast.success("Pagamento registrado com sucesso");
    } catch (err) {
      toast.error("Error ao registar o pagamento");
    }
  };

  const handleOnUpdate = async (data: UpdatePaymentDto): Promise<void> => {
    try {
      await paymentService.update(data);
      await resetPagination();
      toast.success("Pagamento atualizado com sucesso");
    } catch (err) {
      toast.error("Error ao atualizar o pagamento");
    }
  };

  const handleOnRemove = async (id: string): Promise<void> => {
    try {
      await paymentService.remove(id);

      toast.success("Pagamento removido com sucesso");

      resetPagination();
    } catch (err) {
      toast.error("Erro ao remover o pgamento");
    }
  };

  const resetPagination = async (): Promise<void> => {
    closeModal();
    setCurrentPage(1);
    await handleGetAllPayment(1);
  };

  const handleFilterPayment = async (currentPage: number) => {
    const currentSkip = (currentPage - 1) * takePayment;
    const [year, month] = filter.split("-").map(Number);

    if (!year || !month) {
      await handleGetAllPayment(currentPage);
      return;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const { count, payment } = await paymentService.findAll({
      skip: currentSkip,
      take: takePayment,
      where: {
        referenceMonth: {
          // @ts-ignore
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    countPayment = count;
    setPaymentList(payment);
  };

  const handleGetAllPayment = async (currentPage: number): Promise<void> => {
    const currentSkip = (currentPage - 1) * takePayment;
    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { count, payment } = await paymentService.findAll({
      skip: currentSkip,
      take: takePayment,
      where: {
        referenceMonth: {
          // @ts-ignore
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { name: "asc" },
    });

    countPayment = count;
    setPaymentList(payment);
    oldPayment = payment;
  };

  return (
    <div>
      <Table
        enableFilter
        filterType="select"
        filterOptions={monthFilterOptions}
        rows={paymentList}
        take={takePayment}
        currentPage={currentPage}
        title="Listagem de pagamentos"
        onPageChange={setCurrentPage}
        onActionClicked={() => handleOpenModal()}
        countRows={currentCountPayment}
        onFilterChange={(value) => {
          setCurrentPage(1);
          setFilter(value);
        }}
        columns={getColumns({
          handleEdit: handleOpenModal,
          handleRemove: handleOnRemove,
        })}
      />
    </div>
  );
}
