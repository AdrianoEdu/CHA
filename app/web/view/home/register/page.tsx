// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/page";
import RemoveModal from "@/app/web/components/modal/remove-employee/page";
import { UpsertAdvanceReason } from "@/app/web/components/modal/upsert-adavence-reason/page";
import Table from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
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
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldAdvanceReasonList: FindAdvanceReasonDto[] = [];

const { description } = i18n["Pt-Br"].Modal.AdvanceReason;

export default function General() {
  const [filter, setFilter] = useState("");
  const [advanceReasonList, setAdvanceReasonList] = useState<
    FindAdvanceReasonDto[]
  >([]);

  const { closeModal, openModal } = useModal();
  const { user } = useAuth();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleGetAllAdvanceReason();
  }, []);

  useEffect(() => {
    handleFilterAdvanceReasonName();
  }, [filter]);

  const hanleOpenModalRegisterAdvanceReason = (): void => {
    openModal(
      <UpsertAdvanceReason
        onClose={closeModal}
        onRegister={handleRegisterAdvanceReason}
      />,
      "Registrar Motivo do adiantamento",
    );
  };

  const handleGetAllAdvanceReason = async (): Promise<void> => {
    const result = await advanceReasonService.findAll({
      skip: 0,
      take: 20,
      type: ActionEnum.FindAll,
    });

    oldAdvanceReasonList = result;
    setAdvanceReasonList(result);
  };

  const handleRegisterAdvanceReason = async (
    data: CreateAdvanceReasonDto,
  ): Promise<void> => {
    await advanceReasonService.create(data).then(() => {
      toast.success("Motivo registrado com sucesso");
      handleGetAllAdvanceReason();
      closeModal();
    });
  };

  const handleUpdateAdvanceReason = async (
    data: UpdateAdavanceReasonDto,
  ): Promise<void> => {
    await advanceReasonService.update(data).then(() => {
      toast.success("Motivo atualizado com sucesso");
      handleGetAllAdvanceReason();
      closeModal();
    });
  };

  const handleFilterAdvanceReasonName = async () => {
    await handleGenericFilter({
      originalList: oldAdvanceReasonList,
      filter,
      setList: setAdvanceReasonList,
      getSearchField: (emp) => emp.name,
      fetchFromApi: async (value) => {
        return advanceReasonService.findByName({
          name: value,
          type: ActionEnum.FindByName,
        });
      },
    });
  };

  const handleRemoveAdvanceReason = (id: string) => {
    advanceReasonService.delete(id).then(() => {
      closeModal();
      toast.success("Motivo removido com sucesso");
      handleGetAllAdvanceReason();
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
    openModal(
      <RemoveModal
        description={description}
        onClose={closeModal}
        onConfirm={() => handleRemoveAdvanceReason(id)}
      />,
    );
  };

  return (
    <div>
      <Table
        enableFilter
        title={"Motivos"}
        rows={advanceReasonList}
        onRowClick={handleOpenModalEditAdvanceReason}
        onFilterChange={handleSetFilterAdvanceReasonName}
        onActionClicked={hanleOpenModalRegisterAdvanceReason}
        columns={[
          { label: "Criado em", accessor: "createdAt" },
          { label: "Motivo", accessor: "name" },
          {
            label: "Ações",
            isAction: true,
            render: (row) => {
              const isAdmin = user?.role === UserRole.ADMIN;

              return (
                <div className="flex gap-2 justify-center">
                  {isAdmin && (
                    <Button
                      className="bg-red-500"
                      icon={<DeleteIcon />}
                      onClick={(e) => handleOpenModalRemove(e, row.id)}
                    />
                  )}
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
}
