// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/button";
import RemoveModal from "@/app/web/components/modal/remove-employee/remove-employee";
import UpsertAdvanceReason from "@/app/web/components/modal/upsert-advance-reason/upsert-advance-reason";
import Table, { TableColumn } from "@/app/web/components/table/table";
import {
  CreateAdvanceReasonDto,
  FindAdvanceReasonDto,
  UpdateAdavanceReasonDto,
} from "@/app/web/dto/advance-reason.dto";
import { DeleteIcon } from "@/app/web/icons";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { advanceReasonService } from "@/app/web/services/advanceReasonService/advanceReasonService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

let countAdvanceReason = 0;
let oldAdvanceReasonList: FindAdvanceReasonDto[] = [];

const takeAdvanceReason = 20;

export default function General() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [advanceReasonList, setAdvanceReasonList] = useState<
    FindAdvanceReasonDto[]
  >([]);

  const { user } = useAuth();
  const { closeModal, openModal } = useModal();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (filter) {
      handleFilterAdvanceReasonName(currentPage);
      return;
    }

    handleGetAllAdvanceReason(currentPage);
  }, [currentPage, filter]);

  const currentCountAdvanceReason = useMemo(() => {
    return countAdvanceReason;
  }, [countAdvanceReason]);

  const hanleOpenModalRegisterAdvanceReason = (): void => {
    openModal(
      <UpsertAdvanceReason
        onClose={closeModal}
        onRegister={handleRegisterAdvanceReason}
      />,
      "Registrar Motivo do adiantamento",
    );
  };

  const handleGetAllAdvanceReason = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeAdvanceReason;

    const { count, advanceReason } = await advanceReasonService.findAll({
      all: true,
      skip: currentSkip,
      take: takeAdvanceReason,
      orderBy: { createdAt: "desc" },
    });
    countAdvanceReason = count;
    oldAdvanceReasonList = advanceReason;
    setAdvanceReasonList(advanceReason);
  };

  const handleRegisterAdvanceReason = async (
    data: CreateAdvanceReasonDto,
  ): Promise<void> => {
    await advanceReasonService.create(data).then(() => {
      toast.success("Motivo registrado com sucesso");
      handleGetAllAdvanceReason(currentPage);
      closeModal();
    });
  };

  const handleUpdateAdvanceReason = async (
    data: UpdateAdavanceReasonDto,
  ): Promise<void> => {
    await advanceReasonService.update(data).then(() => {
      toast.success("Motivo atualizado com sucesso");
      handleGetAllAdvanceReason(currentPage);
      closeModal();
    });
  };

  const handleFilterAdvanceReasonName = async (page: number) => {
    const currentSkip = (page - 1) * takeAdvanceReason;

    await handleGenericFilter({
      filter,
      originalList: oldAdvanceReasonList,
      setList: setAdvanceReasonList,
      fetchFromApi: async (value) => {
        //@ts-ignore
        const filteredFields = {
          name: { contains: value, mode: "insensitive" },
        } as Partial<FindAdvanceReasonDto>;

        const { advanceReason, count } = await advanceReasonService.findAll({
          all: true,
          skip: currentSkip,
          where: filteredFields,
          take: takeAdvanceReason,
        });

        countAdvanceReason = count;

        return { count, data: advanceReason };
      },
    });
  };

  const handleRemoveAdvanceReason = (id: string) => {
    advanceReasonService.delete(id).then(() => {
      closeModal();
      toast.success("Motivo removido com sucesso");
      handleGetAllAdvanceReason(currentPage);
    });
  };

  const handleSetFilterAdvanceReasonName = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilter(name);
    }, 500);
  };

  const handleOpenModalEditAdvanceReason = (
    row: UpdateAdavanceReasonDto,
  ): void => {
    openModal(
      <UpsertAdvanceReason
        data={row}
        onClose={closeModal}
        onUpdated={handleUpdateAdvanceReason}
      />,
      "Editar Motivo",
    );
  };

  const handleOpenModalRemove = (e: React.MouseEvent, id: string): void => {
    e.stopPropagation();

    const remove = (): void => {
      handleRemoveAdvanceReason(id);
    };

    openModal(<RemoveModal onConfirm={remove} onClose={closeModal} />);
  };

  const getColumns = (): TableColumn<FindAdvanceReasonDto>[] => {
    const columns: TableColumn<FindAdvanceReasonDto>[] = [
      { label: "Criado em", accessor: "createdAt" },
      { label: "Motivo", accessor: "name" },
    ];

    if (isAdmin)
      columns.push({
        label: "Ações",
        isAction: true,
        render: (row) => {
          return (
            <div className="flex gap-2 justify-center">
              <Button
                className="bg-red-500"
                icon={<DeleteIcon />}
                onClick={(e) => handleOpenModalRemove(e, row.id)}
              />
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
        title={"Motivos"}
        columns={getColumns()}
        take={takeAdvanceReason}
        rows={advanceReasonList}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        countRows={currentCountAdvanceReason}
        onRowClick={handleOpenModalEditAdvanceReason}
        onFilterChange={handleSetFilterAdvanceReasonName}
        onActionClicked={hanleOpenModalRegisterAdvanceReason}
      />
    </div>
  );
}
