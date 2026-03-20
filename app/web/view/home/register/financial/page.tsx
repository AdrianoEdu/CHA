// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Table from "@/app/web/components/table/page";
import {
  GetFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from "@/app/web/dto/financial.dto";
import React, { useState } from "react";

export default function FinancialCategory() {
  const [financialList, setFinancialList] =
    useState<GetFinancialCategoryDto[]>();
  const [filter, setFilter] = useState("");

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

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
  ): void => {};

  const handleOpenMocalRegisterFinancialCategory = () => {};

  return (
    <div>
      <Table
        enableFilter
        title={"Entradas e saídas"}
        rows={financialList}
        onFilterChange={handleSetFilterChange}
        onRowClick={handleOpenModalEditFinancialCategory}
        onActionClicked={handleOpenMocalRegisterFinancialCategory}
        columns={[
          { label: "Criado em", accessor: "createdAt" },
          { label: "Nome", accessor: "name" },
          { label: "Tipo", accessor: "financialFlowType" },
        ]}
      />
    </div>
  );
}
