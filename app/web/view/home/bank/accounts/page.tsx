// Copyright (c) 2026-06-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Table, { TableColumn } from "@/app/web/components/table/table";
import { GetCurrentAccountDto } from "@/app/web/dto/current-accont.dto";
import { useState } from "react";

const getColumns = (): TableColumn<GetCurrentAccountDto>[] => {
  return [
    { label: "Registrado em", accessor: "createdAt" },
    { label: "Banco", accessor: "bank.name" },
    { label: "Número da conta", accessor: "accountNumber" },
    { label: "Saldo", accessor: "balance" },
  ];
};

export default function AccountScreen() {
  const [list, setList] = useState<GetCurrentAccountDto[]>();

  return (
    <div>
      <Table
        rows={list}
        onRowClick={() => {}}
        columns={getColumns()}
        title={"Conta Corrente"}
      />
    </div>
  );
}
