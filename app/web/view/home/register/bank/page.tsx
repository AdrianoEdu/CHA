// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import BankModal from "@/app/web/components/modal/upsert-bank/page";
import Table from "@/app/web/components/table/page";
import { BankDto } from "@/app/web/dto/bank.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { bankService } from "@/app/web/services/bankService/bankService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BankScreen() {
  const { openModal, closeModal } = useModal();

  const [listBank, setListBank] = useState<BankDto[]>([]);

  useEffect(() => {
    handleFindBanks();
  }, []);

  const handleFindBanks = async (): Promise<void> => {
    const result = await bankService.findAll({ skip: 0, take: 20 });
    setListBank(result);
  };

  const handleUpsertBank = async (
    data: BankDto,
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

  const handleOpenBankModal = (row?: BankDto): void => {
    openModal(
      <BankModal
        data={row}
        isEdit={!!row?.id}
        onClose={closeModal}
        onSubmit={handleUpsertBank}
      />,
    );
  };

  return (
    <div>
      <Table
        title={"Agências bancárias"}
        rows={listBank}
        onRowClick={handleOpenBankModal}
        onActionClicked={handleOpenBankModal}
        columns={[
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
        ]}
      />
    </div>
  );
}
