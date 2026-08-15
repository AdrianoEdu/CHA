// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UpsertBankStatementModal } from "@/app/web/components/modal/upsert-bank-statement/upsert-bank-statement";
import { BankStatementList } from "@/app/web/components/statement/bank/bank-statement-list";
import Header from "@/app/web/components/statement/header/statement-header";
import { SearchComponent } from "@/app/web/components/statement/search/statement-search";
import { FinancialFlowType } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
import { GetBankStatementDto } from "@/app/web/dto/bank-statemenrt-dto";
import { GetBankDto } from "@/app/web/dto/bank.dto";
import { GetCurrentAccountDto } from "@/app/web/dto/current-accont.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { bankStatementService } from "@/app/web/services/bankStatementService/bankStatementService";
import { currentAccountService } from "@/app/web/services/currentAccountService/currentAcountService";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const takeBankStatement = 20;

const { UpsertBankStatement } = i18n["Pt-Br"].Modal;

const mockDataBankStatement = [
  {
    createdAt: new Date(),
    description: "João da Silva",
    title: "Pix Recebido",
    id: "123",
    value: 250,
    currentAccount: {
      accountNumber: "er2r",
      balance: 343,
      bank: {} as GetBankDto,
      createdAt: new Date(),
      id: "erdwqr",
    },
    financalCategory: {
      financialFlowType: FinancialFlowType.IN,
      createdAt: new Date(),
      id: "122323312",
      name: "asndlk",
    },
  },
  {
    createdAt: new Date(),
    description: "João da Silva",
    title: "Pix Enviado",
    id: "123",
    value: -180,
    currentAccount: {
      accountNumber: "er2r",
      balance: 343,
      bank: {} as GetBankDto,
      createdAt: new Date(),
      id: "erdwqr",
    },
    financalCategory: {
      financialFlowType: FinancialFlowType.OUT,
      createdAt: new Date(),
      id: "122323312",
      name: "asndlk",
    },
  },
  {
    createdAt: new Date(),
    description: "João da Silva",
    title: "Pix Enviado",
    id: "123",
    value: -180,
    currentAccount: {
      accountNumber: "er2r",
      balance: 343,
      bank: {} as GetBankDto,
      createdAt: new Date(),
      id: "erdwqr",
    },
    financalCategory: {
      financialFlowType: FinancialFlowType.OUT,
      createdAt: new Date(),
      id: "122323312",
      name: "asndlk",
    },
  },
  {
    createdAt: new Date(),
    description: "João da Silva",
    title: "Pix Enviado",
    id: "123",
    value: -180,
    currentAccount: {
      accountNumber: "er2r",
      balance: 343,
      bank: {} as GetBankDto,
      createdAt: new Date(),
      id: "erdwqr",
    },
    financalCategory: {
      financialFlowType: FinancialFlowType.OUT,
      createdAt: new Date(),
      id: "122323312",
      name: "asndlk",
    },
  },
  {
    createdAt: new Date(),
    description: "João da Silva",
    title: "Pix Enviado",
    id: "123",
    value: -180,
    currentAccount: {
      accountNumber: "er2r",
      balance: 343,
      bank: {} as GetBankDto,
      createdAt: new Date(),
      id: "erdwqr",
    },
    financalCategory: {
      financialFlowType: FinancialFlowType.OUT,
      createdAt: new Date(),
      id: "122323312",
      name: "asndlk",
    },
  },
  {
    createdAt: new Date(),
    description: "João da Silva",
    title: "Pix Enviado",
    id: "123",
    value: -180,
    currentAccount: {
      accountNumber: "er2r",
      balance: 343,
      bank: {} as GetBankDto,
      createdAt: new Date(),
      id: "erdwqr",
    },
    financalCategory: {
      financialFlowType: FinancialFlowType.OUT,
      createdAt: new Date(),
      id: "122323312",
      name: "asndlk",
    },
  },
];

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
  const [list, setList] = useState<GetBankStatementDto[]>([]);
  const [currentAccount, setCurrentAccount] = useState<GetCurrentAccountDto>();

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
      all: false,
      orderBy: "desc",
      skip: currentSkip.current,
      take,
    });

    totalCount.current = count;
    setList((prev) => [...prev, ...(bankStatement ?? [])]);
    currentSkip.current += bankStatement.length;
  }, []);

  const handleGetBankAccount = async (): Promise<void> => {
    const id = params.id as string;

    const { currentAccount } = await currentAccountService.findAll({
      where: { id },
      include: { bank: true },
    });

    const currentAccountItem = currentAccount[0];

    setCurrentAccount(currentAccountItem);
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
      item.financalCategory.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [list, search]);

  const handleNewStatement = (
    data?: GetBankStatementDto,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();

    openModal(
      <UpsertBankStatementModal
        data={data}
        onRegister={() => {}}
        onUpdate={() => {}}
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
              description: currentAccount?.bank.name ?? "",
            }}
            secondData={{
              title: "Conta",
              description: currentAccount?.accountNumber ?? "",
            }}
            balanceData={currentAccount?.balance ?? 0}
          />
        </div>

        <SearchComponent onChange={setSearch} />

        <BankStatementList
          data={list}
          onSelect={() => alert("xpto")}
          balanceAccount={currentAccount?.balance ?? 0}
        />
      </div>

      <FloatingButton onClick={handleNewStatement} />

      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}
