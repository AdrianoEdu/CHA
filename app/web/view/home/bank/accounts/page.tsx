// Copyright (c) 2026-06-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button from "@/app/web/components/button/button";
import UpserCurrentAccountModal from "@/app/web/components/modal/upsert-current-account/page";
import Table, { TableColumn } from "@/app/web/components/table/table";
import {
  CreateCurrentAccountDto,
  GetCurrentAccountDto,
  UpdateCurrentAccountDto,
} from "@/app/web/dto/current-accont.dto";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { currentAccountService } from "@/app/web/services/currentAccountService/currentAcountService";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

let countCurrentAccounts = 0;
const takeCurrentAccounts = 20;
let oldCurrentAccountList: GetCurrentAccountDto[] = [];

export default function AccountScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState<GetCurrentAccountDto[]>();

  const { openModal, closeModal } = useModal();

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
    router.push(
      `/web/view/home/bank/accounts/statement/${row.id}/${row.accountNumber}`,
    );
  };

  const handleRegisterCurrentAccount = async (
    data: CreateCurrentAccountDto,
  ): Promise<void> => {
    try {
      await currentAccountService.create(data);
      toast.success("Conta corrente criada com sucesso");
    } catch (error) {
      toast.error("Não foi possivel criar conta corrente");
    } finally {
      closeModal();
      await handleFindCurrentAccounts(1);
    }
  };

  const handleUpdateCurrentAccount = async (
    data: UpdateCurrentAccountDto,
  ): Promise<void> => {
    try {
      await currentAccountService.update(data);
      toast.success("Conta corrente atualizada com sucesso");
    } catch (error) {
      toast.error("Não foi possivel atualizar conta corrente");
    } finally {
      closeModal();
      await handleFindCurrentAccounts(1);
    }
  };

  const handleOpenModalUpsertCurrentAccount = (
    mouseEvent?: React.MouseEvent<HTMLButtonElement>,
    data?: UpdateCurrentAccountDto,
  ): void => {
    if (mouseEvent) mouseEvent.stopPropagation;

    openModal(
      <UpserCurrentAccountModal
        data={data}
        onClose={closeModal}
        onUpdated={handleUpdateCurrentAccount}
        onRegister={handleRegisterCurrentAccount}
      />,
    );
  };

  const getColumns = (): TableColumn<GetCurrentAccountDto>[] => {
    return [
      { label: "Registrado em", accessor: "createdAt" },
      { label: "Banco", accessor: "bank.name" },
      { label: "Número da conta", accessor: "accountNumber" },
      { label: "Saldo", accessor: "balance" },
      {
        label: "Ações",
        render(row) {
          <Button
            icon={<EditIcon />}
            className={"bg-green-500"}
            onClick={(e) => handleOpenModalUpsertCurrentAccount(e, row)}
          />;
        },
      },
    ];
  };

  return (
    <div>
      <Table
        rows={list}
        columns={getColumns()}
        title={"Conta corrente"}
        currentPage={currentPage}
        onRowClick={navigateBankStatement}
        onActionClicked={handleOpenModalUpsertCurrentAccount}
      />
    </div>
  );
}
