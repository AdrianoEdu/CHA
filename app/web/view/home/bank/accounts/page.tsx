
// Copyright (c) 2026-06-05
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button from "@/app/web/components/button/button";
import RemoveModal from "@/app/web/components/modal/remove-employee/remove-employee";
import UpserAccountModal from "@/app/web/components/modal/upsert-account/upsert-account";
import Table, { TableColumn } from "@/app/web/components/table/table";
import { AccountType } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
import {
  CreateAccountDto,
  GetAccountDto,
  UpdateAccountDto,
} from "@/app/web/dto/account.dto";
import { DeleteIcon } from "@/app/web/icons";
import EditIcon from "@/app/web/icons/edit-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { accountService } from "@/app/web/services/accountService/acountService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

let countAccounts = 0;
const takeAccounts = 20;
let oldAccountList: GetAccountDto[] = [];

const { AccountScreen: AccountScreenKey } = i18n['Pt-Br'].Screen.AccountScreen;

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
        accountType: true,
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
      `${AccountScreenKey.route}/${row.id}/${row.accountNumber.replaceAll("/", "").replaceAll("-", "")}/${row.accountType}`,
    );
  };

  const handleRegisterAccount = async (
    data: CreateAccountDto,
  ): Promise<void> => {
    try {
      await accountService.create(data);
      toast.success(AccountScreenKey.messages.createSuccess);
    } catch (error) {
      toast.error(AccountScreenKey.messages.createError);
    } finally {
      closeModal();
      await handleFindAccounts(1);
    }
  };

  const handleUpdateAccount = async (data: UpdateAccountDto): Promise<void> => {
    try {
      await accountService.update(data);
      toast.success(AccountScreenKey.messages.updateSuccess);
    } catch (error) {
      toast.error(AccountScreenKey.messages.updateError);
    } finally {
      closeModal();
      await handleFindAccounts(1);
    }
  };

  const handleRemoveAccount = async (id: string): Promise<void> => {
    try {
      await accountService.delete(id)
      toast.success(AccountScreenKey.messages.removeSuccess)
    } catch (error) {
      toast.error(AccountScreenKey.messages.removeError)
    }
    finally {
      closeModal();
      await handleFindAccounts(1)
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

  const handleOpenModalRemoveCurrentAccount = (mouseEvent: React.MouseEvent<HTMLButtonElement>, id: string): void => {
    if (mouseEvent) mouseEvent.stopPropagation();

    openModal(
      <RemoveModal
        onClose={closeModal}
        onConfirm={() => handleRemoveAccount(id)}
      />
    )
  }

  const getColumns = (): TableColumn<GetAccountDto>[] => {
    return [
      { label: AccountScreenKey.columns.createdAt, accessor: "createdAt" },
      { label: AccountScreenKey.columns.bank, accessor: "bank.name" },
      {
        label: AccountScreenKey.columns.accountNumber,
        accessor: "accountNumber",
      },
      { label: AccountScreenKey.columns.balance, accessor: "balance" },
      {
        label: AccountScreenKey.columns.actions,
        render(row) {
          return (
            <div className="flex flex-row gap-2">
              <Button
                icon={<DeleteIcon />}
                className="bg-red-500"
                onClick={(e) => handleOpenModalRemoveCurrentAccount(e, row.id)}
              />
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
            </div>
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
        title={AccountScreenKey.title}
        currentPage={currentPage}
        onRowClick={navigateBankStatement}
        onActionClicked={handleOpenModalUpsertAccount}
      />
    </div>
  );
}
