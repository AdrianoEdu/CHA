// Copyright (c) 2026-09-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UpsertFinancialEntryModal } from "@/app/web/components/modal/upsert-bank-statement/upsert-bank-statement";
import { FinancialEntryList } from "@/app/web/components/statement/bank/bank-statement-list";
import Header from "@/app/web/components/statement/header/statement-header";
import { SearchComponent } from "@/app/web/components/statement/search/statement-search";
import { AccountType } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
import { GetAccountDto } from "@/app/web/dto/account.dto";
import {
  CreateFinancialEntryDto,
  GetFinancialEntryDto,
  UpdateFinancialEntryDto,
} from "@/app/web/dto/general.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { cashBookService } from "@/app/web/services/cashBookService/cashBookService";
import { accountService } from "@/app/web/services/accountService/acountService";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const takeCashBook = 20;

const { UpsertCashBook } = i18n["Pt-Br"].Modal;

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

export default function CashBookPage() {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [account, setAccount] = useState<GetAccountDto>();
  const [list, setList] = useState<GetFinancialEntryDto[]>([]);

  const { openModal, closeModal } = useModal();

  const headerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const currentSkip = useRef(0);
  const totalCount = useRef(0);

  const handleGetCashBook = useCallback(async (): Promise<void> => {
    if (totalCount.current > 0 && currentSkip.current >= totalCount.current)
      return;

    const remaining = totalCount.current - currentSkip.current;
    const take =
      totalCount.current === 0
        ? takeCashBook
        : Math.min(takeCashBook, remaining);

    const { count, cashBook } = await cashBookService.findAll({
      take,
      all: true,
      skip: currentSkip.current,
      orderBy: { createdAt: "desc" },
    });

    totalCount.current = count;
    setList((prev) => [...prev, ...(cashBook ?? [])]);
    currentSkip.current += cashBook.length;
  }, []);

  const handleGetBankAccount = async (): Promise<void> => {
    const id = params.id as string;

    const { account } = await accountService.findAll({
      include: { bank: true },
      where: { id, accountType: AccountType.CASHBOOK },
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
          handleGetCashBook();
        }
      });
    });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [handleGetCashBook]);

  const filteredCashBook = useMemo(() => {
    if (!search.trim()) return list;
    return list.filter((item) =>
      item.financialCategory.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [list, search]);

  const handleRegisterCashBook = async (
    data: CreateFinancialEntryDto,
  ): Promise<void> => {
    if (!account) return;

    try {
      await cashBookService.create({
        ...data,
        accountId: account?.id,
      });
      toast.success("Extrato registrado com successo!");
      closeModal();
    } catch (err) {
      alert(err);
    }
  };

  const handleUpdateCashBook = async (
    data: UpdateFinancialEntryDto,
  ): Promise<void> => {
    try {
      await cashBookService.update(data);
      toast.success("Extrato atualizado com successo!");
      closeModal();
    } catch (error) {
      toast.error("Houve um erro ao atualizar o extrato, tente mais tarde");
    }
  };

  const handleNewStatement = (
    data?: GetFinancialEntryDto,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();

    openModal(
      <UpsertFinancialEntryModal
        data={data}
        onClose={closeModal}
        onUpdate={handleUpdateCashBook}
        onRegister={handleRegisterCashBook}
      />,
      !data ? UpsertCashBook.registerTitle : UpsertCashBook.updateTitle,
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef}>
          <Header
            headerTitle="Livro Caixa"
            buttonTitle="Adicionar extrato"
            onClick={() => handleNewStatement()}
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
