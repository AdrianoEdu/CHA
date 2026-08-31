// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType, Prisma } from "@/app/generated/prisma";
import {
  CreateBankStatementDto,
  GetBankStatementDto,
  GetBankStatementParamsDto,
  UpdateBankStatementDto,
} from "../../dto/BankStatement/BankStatement";
import { PaginationDto } from "../../dto/Pagination/Pagination";
import { databaseService } from "../../providers/database/DatabaseService";
import { BankStatemenrtWithRelations } from "./type";
import { GetBankDtoParams } from "../../dto/Bank/bank";
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
            currentAccount: true,
            financialCategory: true,
          },
        });

        const isOut =
          bankStatement.financialCategory.financialFlowType ===
          FinancialFlowType.OUT;

        const currentValue = isOut
          ? Number(bankStatement.currentAccount.balance) -
            Number(bankStatement.value)
          : Number(bankStatement.currentAccount.balance) +
            Number(bankStatement.value);

        await tx.currentAccount.update({
          data: {
            balance: currentValue,
          },
          where: {
            id: bankStatement.currentAccountId,
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
    this.databaseService.bankStatement.update({
      where: { id: data.id },
      data: { ...data },
    });
  }

  async findBankStatement({
    skip,
    take,
    where,
    include,
    orderBy,
  }: PaginationDto<
    Prisma.BankStatementWhereInput,
    Prisma.BankStatementSelect,
    Prisma.BankStatementInclude,
    Prisma.BankStatementOrderByWithRelationInput
  >): Promise<GetBankStatementParamsDto> {
    const baseQuery: Prisma.BankStatementFindManyArgs = {
      skip,
      where,
      take,
      include,
      orderBy,
    };

    const count = await this.databaseService.bankStatement.count({ where });

    if (where)
      return { count, bankStatement: await this.findMany({ ...baseQuery }) };

    return { count, bankStatement: await this.findMany({ ...baseQuery }) };
  }

  async findMany({
    include,
    orderBy,
    select,
    skip,
    take,
    where,
  }: Prisma.BankStatementFindManyArgs): Promise<GetBankStatementDto[]> {
    const query: Prisma.BankStatementFindManyArgs = {
      skip,
      where,
      take,
      select,
      include,
      orderBy,
    };

    const result = await this.databaseService.bankStatement.findMany({
      ...query,
      include: { currentAccount: true, financialCategory: true },
    });

    return this.mapBankStatement(result);
  }

  mapBankStatement(data: BankStatemenrtWithRelations[]): GetBankStatementDto[] {
    return data.map((bankStatement) => ({
      id: bankStatement.id,
      value: bankStatement.value,
      title: bankStatement.title,
      filePath: bankStatement.filePath,
      createdAt: bankStatement.createdAt,
      description: bankStatement.description,
      currentAccount: {
        ...bankStatement.currentAccount,
        balance: Number(bankStatement.currentAccount.balance),
      },
      financalCategory: bankStatement.financialCategory,
    }));
  }
}

export const bankStatementService = new BankStatementService();
