// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UpsertFinancialCategory } from "@/app/web/components/modal/upsert-financial-category/page";
import Table from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import {
  CreateFinancialCategoryDto,
  GetFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "@/app/web/dto/financial.dto";
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

  const { closeModal, openModal } = useModal();

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

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
          type: ActionEnum.FindByName,
        });
      },
    });
  };
  return (
    <div>
      <Table
        enableFilter
        title={"Entradas e saídas"}
        rows={financialList}
        onFilterChange={handleSetFilterChange}
        onRowClick={handleOpenModalEditFinancialCategory}
        onActionClicked={handleOpenModalRegisterFinancialCategory}
        columns={[
          { label: "Criado em", accessor: "createdAt" },
          { label: "Nome", accessor: "name" },
          {
            label: "Tipo",
            accessor: "financialFlowType",
            render: (row) =>
              row.financialFlowType === "IN" ? "Entrada" : "Saída",
          },
        ]}
      />
    </div>
  );
}
