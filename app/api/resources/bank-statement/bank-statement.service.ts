// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType } from "@/app/generated/prisma";
import {
  CreateBankStatementDto,
  UpdateBankStatementDto,
} from "../../dto/BankStatement/BankStatement";
import { databaseService } from "../../providers/database/DatabaseService";
import { storageSrevice } from "../../providers/storage/storage.service";

class BankStatementService {
  private storageService = storageSrevice;
  private databaseService = databaseService;

  async create(data: CreateBankStatementDto) {
    const { file, ...bankStatementData } = data;

    let key: string | null = null;
    let fileUploaded = false;

    try {
      if (file) {
        const id = crypto.randomUUID();

        const extension = file.name.split(".").pop();

        const date = new Date().toISOString().replace(/:/g, "-");

        key = `bank-statements/${id}/extrato-${date}.${extension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        await this.storageService.upload(buffer, key, file.type);

        fileUploaded = true;
      }

      const result = await this.databaseService.$transaction(async (tx) => {
        const bankStatement = await tx.bankStatement.create({
          data: {
            ...bankStatementData,
            filePath: key ?? "",
          },
          include: {
            account: true,
            financialCategory: true,
          },
        });

        const isOut =
          bankStatement.financialCategory.financialFlowType ===
          FinancialFlowType.OUT;

        const currentValue = isOut
          ? Number(bankStatement.account.balance) - Number(bankStatement.value)
          : Number(bankStatement.account.balance) + Number(bankStatement.value);

        await tx.account.update({
          data: {
            balance: currentValue,
          },
          where: {
            id: bankStatement.accountId,
          },
        });

        return bankStatement;
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

  async update(data: UpdateBankStatementDto) {
    const { id, file, ...bankStatementData } = data;

    let newKey: string | null = null;
    let fileUploaded = false;

    try {
      const currentBankStatement =
        await this.databaseService.bankStatement.findUnique({
          where: { id },
        });

      if (!currentBankStatement) {
        throw new Error("Extrato bancário não encontrado");
      }

      const oldKey = currentBankStatement.filePath;

      if (file) {
        const extension = file.name.split(".").pop();

        const date = new Date().toISOString().replace(/:/g, "-");

        newKey = `bank-statements/${id}/extrato-${date}.${extension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        await this.storageService.upload(buffer, newKey, file.type);

        fileUploaded = true;
      }

      const result = await this.databaseService.$transaction(async (tx) => {
        const bankStatement = await tx.bankStatement.update({
          where: {
            id,
          },
          data: {
            ...bankStatementData,

            ...(newKey && {
              filePath: newKey,
            }),
          },
          include: {
            account: true,
            financialCategory: true,
          },
        });

        return bankStatement;
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
}

export const bankStatementService = new BankStatementService();
