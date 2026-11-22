
// Copyright (c) 2026-06-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button from "@/app/web/components/button/button";
import UpserAccountModal from "@/app/web/components/modal/upsert-account/upsert-account";
import Table, { TableColumn } from "@/app/web/components/table/table";
import { AccountType } from "@/app/web/constants/enum";
import {
  CreateAccountDto,
  GetAccountDto,
  UpdateAccountDto,
} from "@/app/web/dto/account.dto";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { accountService } from "@/app/web/services/accountService/acountService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ACCOUNT_SCREEN_TEXT = {
  messages: {
    createSuccess: "Conta criada com sucesso",
    createError: "Não foi possível criar conta",
    updateSuccess: "Conta atualizada com sucesso",
    updateError: "Não foi possível atualizar conta",
  },
  columns: {
    createdAt: "Registrado em",
    bank: "Banco",
    accountNumber: "Número da conta",
    balance: "Saldo",
    actions: "Ações",
  },
  title: "Conta corrente",
  route: "/web/view/home/bank/accounts/statement",
};

let countAccounts = 0;
const takeAccounts = 20;
let oldAccountList: GetAccountDto[] = [];

export default function AccountScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState<GetAccountDto[]>();

  const { openModal, closeModal } = useModal();

  useEffect(() => {
    handleFindAccounts(currentPage);
  }, []);

  const handleFindAccounts = async (page: number) => {
    const currentSkip = (page - 1) * takeAccounts;

    const { count, account } = await accountService.findAll({
      all: true,
      skip: currentSkip,
      select: {
        id: true,
        bank: true,
        balance: true,
        createdAt: true,
        accountNumber: true,
      },
      take: takeAccounts,
      orderBy: { createdAt: "desc" },
      where: { accountType: AccountType.BANK },
    });

    setList(account);
    oldAccountList = account;

    countAccounts = count;
  };

  const navigateBankStatement = (row: GetAccountDto): void => {
    router.push(
      `${ACCOUNT_SCREEN_TEXT.route}/${row.id}/${row.accountNumber.replaceAll("/", "").replaceAll("-", "")}`,
    );
  };

  const handleRegisterAccount = async (
    data: CreateAccountDto,
  ): Promise<void> => {
    try {
      await accountService.create(data);
      toast.success(ACCOUNT_SCREEN_TEXT.messages.createSuccess);
    } catch (error) {
      toast.error(ACCOUNT_SCREEN_TEXT.messages.createError);
    } finally {
      closeModal();
      await handleFindAccounts(1);
    }
  };

  const handleUpdateAccount = async (data: UpdateAccountDto): Promise<void> => {
    try {
      await accountService.update(data);
      toast.success(ACCOUNT_SCREEN_TEXT.messages.updateSuccess);
    } catch (error) {
      toast.error(ACCOUNT_SCREEN_TEXT.messages.updateError);
    } finally {
      closeModal();
      await handleFindAccounts(1);
    }
  };

  const handleOpenModalUpsertAccount = (
    mouseEvent?: React.MouseEvent<HTMLButtonElement>,
    data?: UpdateAccountDto,
  ): void => {
    if (mouseEvent) mouseEvent.stopPropagation();

    openModal(
      <UpserAccountModal
        data={data}
        onClose={closeModal}
        onUpdated={handleUpdateAccount}
        onRegister={handleRegisterAccount}
      />,
    );
  };

  const getColumns = (): TableColumn<GetAccountDto>[] => {
    return [
      { label: ACCOUNT_SCREEN_TEXT.columns.createdAt, accessor: "createdAt" },
      { label: ACCOUNT_SCREEN_TEXT.columns.bank, accessor: "bank.name" },
      {
        label: ACCOUNT_SCREEN_TEXT.columns.accountNumber,
        accessor: "accountNumber",
      },
      { label: ACCOUNT_SCREEN_TEXT.columns.balance, accessor: "balance" },
      {
        label: ACCOUNT_SCREEN_TEXT.columns.actions,
        render(row) {
          return (
            <Button
              icon={<EditIcon />}
              className="bg-green-500"
              onClick={(e) =>
                handleOpenModalUpsertAccount(e, {
                  id: row.id,
                  bankId: row.bank.id,
                  balance: row.balance,
                  createdAt: row.createdAt,
                  accountNumber: row.accountNumber,
                })
              }
            />
          );
        },
      },
    ];
  };

  return (
    <div>
      <Table
        rows={list}
        columns={getColumns()}
        title={ACCOUNT_SCREEN_TEXT.title}
        currentPage={currentPage}
        onRowClick={navigateBankStatement}
        onActionClicked={handleOpenModalUpsertAccount}
      />
    </div>
  );
}
