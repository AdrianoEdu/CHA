// Copyright (c) 2026-09-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType, Prisma } from "@/app/generated/prisma";
import {
  CreateCashBookDto,
  UpdateCashBookDto,
} from "../../dto/CashBook/CashBook";
import { databaseService } from "../../providers/database/DatabaseService";
import { storageSrevice } from "../../providers/storage/storage.service";
import { GetFinancialEntryDto } from "../../dto/General";
import { mapFinancialEntry } from "../../utils/mapFinancialEntry";

class CashBookService {
  private storageService = storageSrevice;
  private databaseService = databaseService;

  async create(data: CreateCashBookDto) {
    const { file, ...cashBookData } = data;

    let key: string | null = null;
    let fileUploaded = false;

    try {
      if (file) {
        const id = crypto.randomUUID();

        const extension = file.name.split(".").pop();

        const date = new Date().toISOString().replace(/:/g, "-");

        key = `cash-book/${id}/extrato-${date}.${extension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        await this.storageService.upload(buffer, key, file.type);

        fileUploaded = true;
      }

      const result = await this.databaseService.$transaction(async (tx) => {
        const cashBook = await tx.cashBook.create({
          data: {
            ...cashBookData,
            filePath: key ?? "",
          },
          include: {
            currentAccount: true,
            financialCategory: true,
          },
        });

        const isOut =
          cashBook.financialCategory.financialFlowType ===
          FinancialFlowType.OUT;

        const currentValue = isOut
          ? Number(cashBook.currentAccount.balance) - Number(cashBook.value)
          : Number(cashBook.currentAccount.balance) + Number(cashBook.value);

        await tx.currentAccount.update({
          data: {
            balance: currentValue,
          },
          where: {
            id: cashBook.currentAccountId,
          },
        });

        return cashBook;
      });

      return result;
    } catch (error) {
      if (fileUploaded && key) {
        try {
          await this.storageService.delete(key);
        } catch (deleteError) {
          console.error("Erro ao remover arquivo após falha:", deleteError);
        }
      }

      throw error;
    }
  }

  async update(data: UpdateCashBookDto) {
    const { id, file, ...cashBookData } = data;

    let newKey: string | null = null;
    let fileUploaded = false;

    try {
      const currentCashBook = await this.databaseService.cashBook.findUnique({
        where: { id },
      });

      if (!currentCashBook) {
        throw new Error("Livro caixa não encontrado");
      }

      const oldKey = currentCashBook.filePath;

      if (file) {
        const extension = file.name.split(".").pop();

        const date = new Date().toISOString().replace(/:/g, "-");

        newKey = `cash-book/${id}/extrato-${date}.${extension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        await this.storageService.upload(buffer, newKey, file.type);

        fileUploaded = true;
      }

      const result = await this.databaseService.$transaction(async (tx) => {
        const cashBook = await tx.cashBook.update({
          where: {
            id,
          },
          data: {
            ...cashBookData,

            ...(newKey && {
              filePath: newKey,
            }),
          },
          include: {
            currentAccount: true,
            financialCategory: true,
          },
        });

        return cashBook;
      });

      if (file && oldKey) {
        try {
          await this.storageService.delete(oldKey);
        } catch (deleteError) {
          console.error(
            "Erro ao remover arquivo antigo após atualização:",
            deleteError,
          );
        }
      }

      return result;
    } catch (error) {
      if (fileUploaded && newKey) {
        try {
          await this.storageService.delete(newKey);
        } catch (deleteError) {
          console.error(
            "Erro ao remover novo arquivo após falha:",
            deleteError,
          );
        }
      }

      throw error;
    }
  }

  async findCashBook({
    include,
    orderBy,
    select,
    skip,
    take,
    where,
  }: Prisma.CashBookFindManyArgs): Promise<GetFinancialEntryDto[]> {
    const query: Prisma.CashBookFindManyArgs = {
      skip,
      where,
      take,
      select,
      include,
      orderBy,
    };

    const result = await this.databaseService.cashBook.findMany({
      ...query,
      include: { currentAccount: true, financialCategory: true },
    });

    return mapFinancialEntry(result);
  }
}

export const cashBookService = new CashBookService();
