// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/button";
import RemoveModal from "@/app/web/components/modal/remove-employee/remove-employee";
import BankModal from "@/app/web/components/modal/upsert-bank/upsert-bank";
import Table, { TableColumn } from "@/app/web/components/table/table";
import { GetBankDto } from "@/app/web/dto/bank.dto";
import { DeleteIcon } from "@/app/web/icons";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { bankService } from "@/app/web/services/bankService/bankService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

let countBank = 0;
let oldBankList: GetBankDto[] = [];

const takeBank = 20;

export default function BankScreen() {
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listBank, setListBank] = useState<GetBankDto[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (filter) {
      handleFilterBank(currentPage);
      return;
    }

    handleFindBanks(currentPage);
  }, [currentPage, filter]);

  const currentCountBank = useMemo(() => {
    return countBank;
  }, [countBank]);

  const handleFindBanks = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeBank;

    const { banks, count } = await bankService.findAll({
      all: true,
      take: takeBank,
      skip: currentSkip,
      orderBy: { createdAt: "desc" },
    });

    setListBank(banks);
    oldBankList = banks;

    countBank = count;
  };

  const handleFilterBank = async (page: number) => {
    const currentSkip = (page - 1) * takeBank;

    await handleGenericFilter({
      originalList: oldBankList,
      filter,
      setList: setListBank,
      fetchFromApi: async (value) => {
        const parsed = Number(value);

        // @ts-ignore
        const filteredFields: Partial<GetBankDto> = Number.isNaN(parsed)
          ? { name: { contains: value, mode: "insensitive" } }
          : { agencies: [Number(value)] };

        const { count, banks } = await bankService.findAll({
          all: true,
          take: takeBank,
          skip: currentSkip,
          where: filteredFields,
        });

        countBank = count;

        return { count, data: banks };
      },
    });
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

    await handleFindBanks(1);
    closeModal();
  };

  const handleRemoveBank = (id: string): void => {
    bankService.remove(id).then(() => {
      closeModal();
      toast.success("Agência bancária com sucessp");
      handleFindBanks(1);
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

  const handleSetFilterBankName = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (name === "") setCurrentPage(1);
      setFilter(name);
    }, 500);
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
        enableFilter
        rows={listBank}
        take={takeBank}
        columns={getColumns()}
        currentPage={currentPage}
        countRows={currentCountBank}
        title={"Agências bancárias"}
        onRowClick={handleOpenBankModal}
        onActionClicked={handleOpenBankModal}
        onFilterChange={handleSetFilterBankName}
        onPageChange={(page) => {
          console.log("PAGE RECEBIDA:", page);

          if (page < 1) {
            console.error("Página inválida:", page);
            return;
          }

          setCurrentPage(page);
        }}
      />
    </div>
  );
}
