// Copyright (c) 2026-07-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { FloatingButton } from "@/app/web/components/floatingButton/page";
import { BankStatementList } from "@/app/web/components/statement/bank/page";
import Header from "@/app/web/components/statement/header/page";
import { SearchComponent } from "@/app/web/components/statement/search/page";
import { FinancialFlowType } from "@/app/web/constants/enum";
import { GetBankStatementDto } from "@/app/web/dto/bank-statemenrt-dto";
import { GetBankDto } from "@/app/web/dto/bank.dto";
import { bankStatementService } from "@/app/web/services/bankStatementService/bankStatementService";
import { useEffect, useMemo, useRef, useState } from "react";

let currentSkip = 0;
const takeBankStatement = 20;
let totalCount = 0;

export default function StatementPage() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState<GetBankStatementDto[]>([]);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleGetBankStatement();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingButton(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleGetBankStatement = async (): Promise<void> => {
    if (totalCount > 0 && currentSkip >= totalCount) return;

    const remaining = totalCount - currentSkip;

    const take =
      totalCount === 0
        ? takeBankStatement
        : Math.min(takeBankStatement, remaining);

    const { count, bankStatement } = await bankStatementService.findAll({
      all: false,
      orderBy: "desc",
      skip: currentSkip,
      take,
    });

    totalCount = count;

    setList((prev) => [...prev, ...(bankStatement ?? [])]);

    currentSkip += bankStatement.length;
  };

  const filteredBankStatement = useMemo(() => {
    if (!search.trim()) {
      return list;
    }

    return list.filter((item) =>
      item.financalCategory.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [list, search]);

  const handleNewStatement = () => {
    console.log("Novo lançamento");
  };

  const handleOnChangeSearch = (search: string): void => setSearch(search);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef}>
          <Header
            onClick={handleNewStatement}
            balanceData={5250}
            buttonTitle={
              showFloatingButton ? '' : "Adicionar extrato"
            }
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

        <SearchComponent onChange={handleOnChangeSearch} />

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

      {showFloatingButton && (
        <FloatingButton onClick={handleNewStatement} />
      )}

      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}