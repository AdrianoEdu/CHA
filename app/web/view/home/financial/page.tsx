// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/page";
import RemoveModal from "@/app/web/components/modal/remove-employee/page";
import { UpsertFinancialCategory } from "@/app/web/components/modal/upsert-financial-category/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import {
  CreateFinancialCategoryDto,
  GetFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "@/app/web/dto/financial.dto";
import { DeleteIcon } from "@/app/web/icons";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { financialCategoryService } from "@/app/web/services/financialCategoryService/financialCategoryService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

let oldFinancialList: GetFinancialCategoryDto[] = [];

export default function FinancialCategory() {
  const [financialList, setFinancialList] =
    useState<GetFinancialCategoryDto[]>();
  const [filter, setFilter] = useState("");

  const { user } = useAuth();
  const { closeModal, openModal } = useModal();

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const isAdmin = user.role === UserRole.ADMIN;

  useEffect(() => {
    handleGetAllFinancialCategory();
  }, []);

  useEffect(() => {
    handleFilterFinancialCategoryName();
  }, [filter]);

  function handleSetFilterChange(value: string) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilter?.(value);
    }, 500);
  }

  const handleOpenModalEditFinancialCategory = (
    row: UpdateFinancialCategoryDto,
  ): void => {
    openModal(
      <UpsertFinancialCategory
        data={row}
        onClose={closeModal}
        onUpdated={handleUpdateFinancialCategory}
      />,
      "Editar uma categoria financeira",
    );
  };

  const handleGetAllFinancialCategory = async (): Promise<void> => {
    const result = await financialCategoryService.findAll({
      skip: 0,
      take: 20,
      type: ActionEnum.FindAll,
    });

    setFinancialList(result);
    oldFinancialList = result;
  };

  const handleOpenModalRegisterFinancialCategory = () => {
    openModal(
      <UpsertFinancialCategory
        onClose={closeModal}
        onRegister={handleRegisterFinancialCategory}
      />,
      "Registrar categoria financeira",
    );
  };

  const handleRegisterFinancialCategory = (
    data: CreateFinancialCategoryDto,
  ): void => {
    financialCategoryService.create(data).then(() => {
      toast.success("Categoria financeira registrada com sucesso");
      handleGetAllFinancialCategory();
      closeModal();
    });
  };

  const handleUpdateFinancialCategory = (
    data: UpdateFinancialCategoryDto,
  ): void => {
    financialCategoryService.update(data).then(() => {
      toast.success("Categoria financeira atualizada com sucesso");
      handleGetAllFinancialCategory();
      closeModal();
    });
  };

  const handleFilterFinancialCategoryName = async () => {
    await handleGenericFilter({
      originalList: oldFinancialList,
      filter,
      setList: setFinancialList,
      getSearchField: (emp) => emp.name,
      fetchFromApi: async (value) => {
        return financialCategoryService.findByName({
          name: value,
          type: ActionEnum.FindByFilters,
        });
      },
    });
  };

  const handleRemoveFinancialCategory = (categoryId: string): void => {
    financialCategoryService.delete(categoryId).then(() => {
      closeModal();
      toast.success("Categoria financeira removida com sucesso");
      handleGetAllFinancialCategory();
    });
  };

  const handleOpenModalRemove = (
    e: React.MouseEvent,
    categoryId: string,
  ): void => {
    e.stopPropagation();

    const remove = (): void => {
      handleRemoveFinancialCategory(categoryId);
    };

    openModal(<RemoveModal onClose={closeModal} onConfirm={remove} />);
  };

  const getColumns = (): TableColumn<GetFinancialCategoryDto>[] => {
    const columns: TableColumn<GetFinancialCategoryDto>[] = [
      { label: "Criado em", accessor: "createdAt" },
      { label: "Nome", accessor: "name" },
      {
        label: "Tipo",
        accessor: "financialFlowType",
        render: (row) => (row.financialFlowType === "IN" ? "Entrada" : "Saída"),
      },
    ];

    if (isAdmin)
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
        rows={financialList}
        columns={getColumns()}
        title={"Entradas e saídas"}
        onFilterChange={handleSetFilterChange}
        onRowClick={handleOpenModalEditFinancialCategory}
        onActionClicked={handleOpenModalRegisterFinancialCategory}
      />
    </div>
  );
}
