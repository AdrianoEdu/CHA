// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UpsertFinancialEntryModal } from "@/app/web/components/modal/upsert-bank-entry/upsert-bank-entry";
import { FinancialEntryList } from "@/app/web/components/statement/bank/bank-statement-list";
import Header from "@/app/web/components/statement/header/statement-header";
import { SearchComponent } from "@/app/web/components/statement/search/statement-search";
import { i18n } from "@/app/web/constants/i18n";
import {
  CreateBankStatementDto,
  GetBankStatementDto,
  UpdateBankStatementDto,
} from "@/app/web/dto/bank-statemenrt-dto";
import { GetAccountDto } from "@/app/web/dto/account.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { bankStatementService } from "@/app/web/services/bankStatementService/bankStatementService";
import { accountService } from "@/app/web/services/accountService/acountService";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AccountType } from "@/app/web/constants/enum";

const takeBankStatement = 20;

const { UpsertBankStatement } = i18n["Pt-Br"].Components.Modal;
const { BankStatement } = i18n['Pt-Br'].Screen.BankStatement;

function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={BankStatement.addMovement}
      className="
        fixed
        bottom-6
        right-10
        z-50
        h-12 w-12
        rounded-full
        bg-blue-600 text-white
        flex items-center justify-center
        text-2xl font-light
        shadow-lg
        transition-all duration-200
        hover:bg-blue-700 hover:scale-110
        active:scale-95
      "
    >
      +
    </button>
  );
}

export default function StatementPage() {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [account, setAccount] = useState<GetAccountDto>();
  const [list, setList] = useState<GetBankStatementDto[]>([]);

  const { openModal, closeModal } = useModal();

  const headerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const currentSkip = useRef(0);
  const totalCount = useRef(0);

  const handleRefreshBankStatement = async (): Promise<void> => {
    currentSkip.current = 0;
    totalCount.current = 0;

    setList([]);

    await handleGetBankAccount();
    await handleGetBankStatement();
  };

  const handleGetBankStatement = useCallback(async (): Promise<void> => {
    if (totalCount.current > 0 && currentSkip.current >= totalCount.current)
      return;

    const remaining = totalCount.current - currentSkip.current;
    const take =
      totalCount.current === 0
        ? takeBankStatement
        : Math.min(takeBankStatement, remaining);

    const { count, bankStatement } = await bankStatementService.findAll({
      take,
      all: true,
      skip: currentSkip.current,
      orderBy: { createdAt: "desc" },
    });

    totalCount.current = count;
    setList((prev) => [...prev, ...(bankStatement ?? [])]);
    currentSkip.current += bankStatement.length;
  }, []);

  const handleGetBankAccount = async (): Promise<void> => {
    const id = params.id as string;

    const { account } = await accountService.findAll({
      where: { id },
      include: { bank: true },
    });

    const accountItem = account[0];

    setAccount(accountItem);
  };

  useEffect(() => {
    handleGetBankAccount();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === loadMoreRef.current && entry.isIntersecting) {
          handleGetBankStatement();
        }
      });
    });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [handleGetBankStatement]);

  // const filteredBankStatement = useMemo(() => {
  //   if (!search.trim()) return list;
  //   return list.filter((item) =>
  //     item.financialCategory.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  // }, [list, search]);

  const handleRegisterBankStatement = async (
    data: CreateBankStatementDto,
  ): Promise<void> => {
    if (!account) return;

    try {
      await bankStatementService.create({
        ...data,
        accountId: account?.id,
      });
      toast.success(BankStatement.messages.registerSuccess);
    } catch (err) {
      toast.error(BankStatement.messages.registerError)
    }
    finally {
      closeModal();
      await handleRefreshBankStatement()
    }
  };

  const handleUpdateBankStatement = async (
    data: UpdateBankStatementDto,
  ): Promise<void> => {
    try {
      await bankStatementService.update(data);
      toast.success(BankStatement.messages.updateSuccess);
    } catch (error) {
      toast.error(BankStatement.messages.updateError);
    }
    finally {
      closeModal();
      await handleRefreshBankStatement()
    }
  };

  const handleNewStatement = (
    data?: GetBankStatementDto,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();

    openModal(
      <UpsertFinancialEntryModal
        data={data}
        onClose={closeModal}
        onUpdate={handleUpdateBankStatement}
        accountType={params.type as AccountType}
        onRegister={handleRegisterBankStatement}
      />,
      !data
        ? UpsertBankStatement.registerTitle
        : UpsertBankStatement.updateTitle,
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef}>
          <Header
            headerTitle={BankStatement.title}
            buttonTitle={BankStatement.addStatement}
            onClick={() => handleNewStatement()}
            primaryData={{
              title: BankStatement.fields.bank,
              description: account?.bank.name ?? "",
            }}
            secondData={{
              title: BankStatement.fields.account,
              description: account?.accountNumber ?? "",
            }}
            balanceData={account?.balance ?? 0}
          />
        </div>

        <SearchComponent onChange={setSearch} />

        <FinancialEntryList
          data={list}
          onSelect={() => { }}
          balanceAccount={account?.balance ?? 0}
        />
      </div>

      <FloatingButton
        onClick={() => {
          handleNewStatement();
        }}
      />

      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}
