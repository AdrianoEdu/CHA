// Copyright (c) 2026-06-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Table, { TableColumn } from "@/app/web/components/table/table";
import { GetCurrentAccountDto } from "@/app/web/dto/current-accont.dto";
import { currentAccountService } from "@/app/web/services/currentAccountService/currentAcountService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getColumns = (): TableColumn<GetCurrentAccountDto>[] => {
  return [
    { label: "Registrado em", accessor: "createdAt" },
    { label: "Banco", accessor: "bank.name" },
    { label: "Número da conta", accessor: "accountNumber" },
    { label: "Saldo", accessor: "balance" },
  ];
};

let countCurrentAccounts = 0;
const takeCurrentAccounts = 20;
let oldCurrentAccountList: GetCurrentAccountDto[] = [];

export default function AccountScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState<GetCurrentAccountDto[]>();

  useEffect(() => {
    handleFindCurrentAccounts(currentPage);
  }, []);

  const handleFindCurrentAccounts = async (page: number) => {
    const currentSkip = (page - 1) * takeCurrentAccounts;

    const { count, currentAccount } = await currentAccountService.findAll({
      all: true,
      skip: currentSkip,
      select: {
        id: true,
        bank: true,
        balance: true,
        createdAt: true,
        accountNumber: true,
      },
      take: takeCurrentAccounts,
      orderBy: { createdAt: "desc" },
    });

    setList(currentAccount);
    oldCurrentAccountList = currentAccount;

    countCurrentAccounts = count;
  };

  const navigateBankStatement = (row: GetCurrentAccountDto): void => {
    router.push(`/web/view/home/bank/accounts/${row.id}/${row.accountNumber}`);
  };

  return (
    <div>
      <Table
        rows={list}
        columns={getColumns()}
        title={"Conta Corrente"}
        onRowClick={navigateBankStatement}
      />
    </div>
  );
}
