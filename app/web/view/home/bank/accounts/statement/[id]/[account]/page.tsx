// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { BankStatementList } from "@/app/web/components/statement/bank/page";
import Header from "@/app/web/components/statement/header/page";
import { SearchComponent } from "@/app/web/components/statement/search/page";
import { FinancialFlowType } from "@/app/web/constants/enum";
import { GetBankStatementDto } from "@/app/web/dto/bank-statemenrt-dto";
import { GetBankDto } from "@/app/web/dto/bank.dto";
import { GetCurrentAccountDto } from "@/app/web/dto/current-accont.dto";
import { bankStatementService } from "@/app/web/services/bankStatementService/bankStatementService";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const takeBankStatement = 20;

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

  const headerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const currentSkip = useRef(0);
  const totalCount = useRef(0);

  const handleGetBankStatement = useCallback(async (): Promise<void> => {
    if (totalCount.current > 0 && currentSkip.current >= totalCount.current) return;

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
      item.financalCategory.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

  const handleNewStatement = () => {
    console.log("Novo lançamento");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef}>
          <Header
            onClick={handleNewStatement}
            balanceData={5250}
            buttonTitle="Adicionar extrato"
            headerTitle="Extrato bancário"
            primaryData={{
              title: "Banco",
              description: "Banco do Brasil",
            }}
            secondData={{
              title: "Conta",
              description: "00012345-6",
            }}
          />
        </div>

        <SearchComponent onChange={setSearch} />

        <BankStatementList
          data={[
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
          ]}
          balanceAccount={5250}
          onSelect={() => alert("xpto")}
        />
      </div>

      <FloatingButton onClick={handleNewStatement} />

      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}
