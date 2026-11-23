// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/button";
import RemoveModal from "@/app/web/components/modal/remove-employee/remove-employee";
import UpsertFinancialCategory from "@/app/web/components/modal/upsert-financial-category/upsert-financial-category";
import Table, { TableColumn } from "@/app/web/components/table/table";
import { AccountType } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
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
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

let countFinancial = 0;
let oldFinancialList: GetFinancialCategoryDto[] = [];

const takeFinancial = 20;

const { FinancialCategory: FinancialCategoryKey } = i18n["Pt-Br"].Components.ComboBox;
const { Table: TableKey, messages } = i18n["Pt-Br"].Screen.FinancialCategory;
const { editTitle, registerTitle } = i18n["Pt-Br"].Components.Modal.UpsertFinancialCategory;

export default function FinancialCategory() {
  const [financialList, setFinancialList] =
    useState<GetFinancialCategoryDto[]>();
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const { closeModal, openModal } = useModal();

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const isAdmin = user.role === UserRole.ADMIN;

  useEffect(() => {
    if (filter) {
      handleFilterFinancialCategoryName(currentPage);
      return;
    }

    handleGetAllFinancialCategory(currentPage);
  }, [currentPage, filter]);

  const currentCountFinancial = useMemo(() => {
    return countFinancial;
  }, [countFinancial]);

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
      editTitle,
    );
  };

  const handleGetAllFinancialCategory = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeFinancial;

    const { count, financialCategories } =
      await financialCategoryService.findAll({
        all: true,
        skip: currentSkip,
        take: takeFinancial,
        orderBy: { createdAt: "desc" },
      });

    countFinancial = count;
    setFinancialList(financialCategories);
    oldFinancialList = financialCategories;
  };

  const handleOpenModalRegisterFinancialCategory = () => {
    openModal(
      <UpsertFinancialCategory
        onClose={closeModal}
        onRegister={handleRegisterFinancialCategory}
      />,
      registerTitle,
    );
  };

  const handleRegisterFinancialCategory = async (
    data: CreateFinancialCategoryDto,
  ): Promise<void> => {
    try {
      await financialCategoryService.create(data);
      toast.success(messages.registerSuccess);

    } catch (error) {
      toast.error(messages.registerError)
    } finally {
      handleGetAllFinancialCategory(currentPage);
      closeModal();
    }
  };

  const handleUpdateFinancialCategory = async (
    data: UpdateFinancialCategoryDto,
  ): Promise<void> => {
    try {
      await financialCategoryService.update(data)
      toast.success(messages.updateSuccess);
    } catch (error) {
      toast.error(messages.updateError)
    } finally {
      handleGetAllFinancialCategory(currentPage);
      closeModal();
    }
  };

  const handleFilterFinancialCategoryName = async (page: number) => {
    const currentSkip = (page - 1) * takeFinancial;

    await handleGenericFilter({
      filter,
      setList: setFinancialList,
      originalList: oldFinancialList,
      fetchFromApi: async (value) => {
        // @ts-ignore
        const filteredFields = {
          name: { contains: value, mode: "insensitive" },
        } as Partial<GetFinancialCategoryDto>;

        const { count, financialCategories } =
          await financialCategoryService.findAll({
            all: true,
            skip: currentSkip,
            take: takeFinancial,
            where: filteredFields,
          });

        countFinancial = count;

        return { count, data: financialCategories };
      },
    });
  };

  const handleRemoveFinancialCategory = async (categoryId: string): Promise<void> => {
    try {
      await financialCategoryService.delete(categoryId)
      toast.success(messages.removeSuccess)
    } catch (error) {
      toast.error(messages.removeError)
    } finally {
      closeModal();
      handleGetAllFinancialCategory(currentPage);
    }
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
      { label: TableKey.columns.createdAt, accessor: "createdAt" },
      { label: TableKey.columns.name, accessor: "name" },
      {
        label: TableKey.columns.reference,
        render(row) {
          return row.accountType === AccountType.BANK ? FinancialCategoryKey.ACCOUNT_TYPE.BANK : FinancialCategoryKey.ACCOUNT_TYPE.CASHBOOK;
        },
      },
      {
        label: TableKey.columns.type,
        accessor: "financialFlowType",
        render: (row) => (row.financialFlowType === "IN" ? FinancialCategoryKey.FINANCIAL_FLOW.IN : FinancialCategoryKey.FINANCIAL_FLOW.OUT),
      },
    ];

    if (isAdmin)
      if (isAdmin)
        columns.push({
          label: TableKey.columns.actions,
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
        take={takeFinancial}
        rows={financialList}
        columns={getColumns()}
        title={TableKey.title}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        countRows={currentCountFinancial}
        onFilterChange={handleSetFilterChange}
        onRowClick={handleOpenModalEditFinancialCategory}
        onActionClicked={handleOpenModalRegisterFinancialCategory}
      />
    </div>
  );
}
