// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Table from "@/app/web/components/table/page";
import { useParams } from "next/navigation";

export default function EmployeeAdvanced() {
  const params = useParams();
  const id = params.id;

  return (
    <Table
      columns={[{ label: "Ola", accessor: "ola" }]}
      title="Pagamento ao funcionáro"
    />
  );
}
