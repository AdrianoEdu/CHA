// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UpsertFinancialEntryModal } from "@/app/web/components/modal/upsert-bank-statement/upsert-bank-statement";
import { FinancialEntryList } from "@/app/web/components/statement/bank/bank-statement-list";
import Header from "@/app/web/components/statement/header/statement-header";
import { SearchComponent } from "@/app/web/components/statement/search/statement-search";
import { i18n } from "@/app/web/constants/i18n";
import {
  CreateBankStatementDto,
  GetBankStatementDto,
  UpdateBankStatementDto,
} from "@/app/web/dto/bank-statemenrt-dto";
import { GetBankDto } from "@/app/web/dto/bank.dto";
import { GetAccountDto } from "@/app/web/dto/account.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { bankStatementService } from "@/app/web/services/bankStatementService/bankStatementService";
import { accountService } from "@/app/web/services/accountService/acountService";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const takeBankStatement = 20;

const { UpsertBankStatement } = i18n["Pt-Br"].Modal;

function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Adicionar movimentação"
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

  const filteredBankStatement = useMemo(() => {
    if (!search.trim()) return list;
    return list.filter((item) =>
      item.financialCategory.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [list, search]);

  const handleRegisterBankStatemen = async (
    data: CreateBankStatementDto,
  ): Promise<void> => {
    if (!account) return;

    try {
      await bankStatementService.create({
        ...data,
        accountId: account?.id,
      });
      toast.success("Extrato registrado com successo!");
      closeModal();
    } catch (err) {
      alert(err);
    }
  };

  const handleUpdateBankStatement = async (
    data: UpdateBankStatementDto,
  ): Promise<void> => {
    try {
      await bankStatementService.update(data);
      toast.success("Extrato atualizado com successo!");
      closeModal();
    } catch (error) {
      toast.error("Houve um erro ao atualizar o extrato, tente mais tarde");
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
        onRegister={handleRegisterBankStatemen}
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
            onClick={() => handleNewStatement()}
            buttonTitle="Adicionar extrato"
            headerTitle="Extrato bancário"
            primaryData={{
              title: "Banco",
              description: account?.bank.name ?? "",
            }}
            secondData={{
              title: "Conta",
              description: account?.accountNumber ?? "",
            }}
            balanceData={account?.balance ?? 0}
          />
        </div>

        <SearchComponent onChange={setSearch} />

        <FinancialEntryList
          data={list}
          onSelect={() => alert("xpto")}
          balanceAccount={account?.balance ?? 0}
        />
      </div>

      <FloatingButton onClick={handleNewStatement} />

      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}
