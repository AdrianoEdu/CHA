// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Table, { TableColumn } from "@/app/web/components/table/page";
import { ReceivedCheckDTO } from "@/app/web/dto/receive-check.dto";
import { useState } from "react";

export const getColumns = (): TableColumn<ReceivedCheckDTO>[] => [
  { label: "Criado em", accessor: "createdAt" },
  { label: "Nome do cliente", accessor: "customerName" },
  { label: "Banco", accessor: "bankName" },
  { label: "Agência", accessor: "agency" },
  { label: "Cheque", accessor: "checkNumber" },
  {
    label: "Valor",
    accessor: "totalAmount",
    render: (row) => `R$ ${row.totalAmount.toFixed(2)}`,
  },
  {
    label: "Status",
    accessor: "status",
    render: (row) => {
      const statusMap: Record<string, string> = {
        RECEIVED: "Recebido",
        IN_USE: "Em uso",
        FINALIZED: "Finalizado",
        CANCELLED: "Cancelado",
      };

      const colorMap: Record<string, string> = {
        RECEIVED: "bg-green-100 text-green-800",
        IN_USE: "bg-yellow-100 text-yellow-800",
        FINALIZED: "bg-blue-100 text-blue-800",
        CANCELLED: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            colorMap[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusMap[row.status] || row.status}
        </span>
      );
    },
  },
];

export default function ReceiveCheck() {
  const [receivedChecks, setReceivedChecks] = useState();

  function handleOpenModalEditReceivedCheck(row: ReceivedCheckDTO): void {
    throw new Error("Function not implemented.");
  }

  function handleSetFilterReceivedCheckName(value: string): void {
    throw new Error("Function not implemented.");
  }

  function hanleOpenModalRegisterReceivedCheck(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <Table
        enableFilter
        rows={receivedChecks}
        columns={getColumns()}
        title={"Cheques recebidos"}
        onRowClick={handleOpenModalEditReceivedCheck}
        onFilterChange={handleSetFilterReceivedCheckName}
        onActionClicked={hanleOpenModalRegisterReceivedCheck}
      />
    </div>
  );
}

// export default function ReceivedCheckForm() {
//   const [form, setForm] = useState({
//     customerId: "",
//     bankId: "",
//     agency: "",
//     checkNumber: "",
//     totalAmount: "",
//     goodForAt: "",
//   });

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   }

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     console.log("DADOS DO FORM:", form);
//     alert("Dados capturados! Veja no console.");
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
//       >
//         <h1 className="text-xl font-bold text-center">
//           Cadastro de Cheque Recebido
//         </h1>

//         <input
//           name="customerId"
//           placeholder="Customer ID"
//           className="w-full border p-2 rounded"
//           onChange={handleChange}
//         />

//         <input
//           name="bankId"
//           placeholder="Bank ID"
//           className="w-full border p-2 rounded"
//           onChange={handleChange}
//         />

//         <input
//           name="agency"
//           placeholder="Agência"
//           className="w-full border p-2 rounded"
//           onChange={handleChange}
//         />

//         <input
//           name="checkNumber"
//           placeholder="Número do cheque"
//           className="w-full border p-2 rounded"
//           onChange={handleChange}
//         />

//         <input
//           name="totalAmount"
//           type="number"
//           placeholder="Valor"
//           className="w-full border p-2 rounded"
//           onChange={handleChange}
//         />

//         <input
//           name="goodForAt"
//           type="date"
//           className="w-full border p-2 rounded"
//           onChange={handleChange}
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           Capturar Dados
//         </button>
//       </form>
//     </div>
//   );
// }
