// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/page";
import RemoveModal from "@/app/web/components/modal/remove-employee/page";
import BankModal from "@/app/web/components/modal/upsert-bank/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import { GetBankDto } from "@/app/web/dto/bank.dto";
import { DeleteIcon } from "@/app/web/icons";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { bankService } from "@/app/web/services/bankService/bankService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BankScreen() {
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  const [listBank, setListBank] = useState<GetBankDto[]>([]);

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    handleFindBanks();
  }, []);

  const handleFindBanks = async (): Promise<void> => {
    const result = await bankService.findAll({
      skip: 0,
      take: 20,
      all: true,
      orderBy: { createdAt: "desc" },
    });

    if (Array.isArray(result)) setListBank(result);
  };

  const handleUpsertBank = async (
    data: GetBankDto,
    isEdit?: boolean,
  ): Promise<void> => {
    if (isEdit)
      await bankService
        .update(data)
        .then(() => toast.success("Atualizado com sucesso"));
    else
      await bankService
        .create(data)
        .then(() => toast.success("Criado com sucesso"));

    await handleFindBanks();
    closeModal();
  };

  const handleRemoveBank = (id: string): void => {
    bankService.remove(id).then(() => {
      closeModal();
      toast.success("Agência bancária com sucessp");
      handleFindBanks();
    });
  };

  const handleOpenBankModal = (row?: GetBankDto): void => {
    openModal(
      <BankModal
        data={row}
        isEdit={!!row?.id}
        onClose={closeModal}
        onSubmit={handleUpsertBank}
      />,
    );
  };

  const handleOpenModalRemove = async (
    e: React.MouseEvent,
    id: string,
  ): Promise<void> => {
    e.stopPropagation();

    const remove = (): void => {
      handleRemoveBank(id);
    };

    openModal(<RemoveModal onClose={closeModal} onConfirm={remove} />);
  };

  const getColumns = (): TableColumn<GetBankDto>[] => {
    const columns: TableColumn<GetBankDto>[] = [
      { label: "Criado em", accessor: "createdAt" },
      { label: "Nome", accessor: "name" },
      {
        label: "Agências",
        render: (row) => {
          return (
            <div className="flex flex-wrap justify-center gap-2">
              {row.agencies?.map((agency: string, index: number) => (
                <div
                  key={agency}
                  className="flex items-center gap-1 rounded text-base"
                >
                  {row.agencies.length === index + 1 ? (
                    <span>{agency}</span>
                  ) : (
                    <span>{`${agency},`}</span>
                  )}
                </div>
              ))}
            </div>
          );
        },
      },
    ];

    if (isAdmin)
      columns.push({
        label: "Ações",
        render: (row) => {
          return (
            <div className="flex gap-2 justify-center">
              {isAdmin && (
                <Button
                  icon={<DeleteIcon />}
                  className="bg-red-500"
                  onClick={(e) => handleOpenModalRemove(e, row.id)}
                />
              )}
            </div>
          );
        },
      });

    return columns;
  };

  return (
    <div>
      <Table
        rows={listBank}
        columns={getColumns()}
        title={"Agências bancárias"}
        onRowClick={handleOpenBankModal}
        onActionClicked={handleOpenBankModal}
      />
    </div>
  );
}
