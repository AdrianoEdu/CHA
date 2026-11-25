
// Copyright (c) 2026-09-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { FinancialFlowType, Prisma, ReceivedCheckStatus } from "@/app/generated/prisma";
import {
  CashBookParams,
  CreateCashBookDto,
  GetCashBookParamsDto,
  UpdateCashBookDto,
} from "../../dto/CashBook/CashBook";
import { databaseService } from "../../providers/database/DatabaseService";
import { storageSrevice } from "../../providers/storage/storage.service";
import { CashBookWithRelations } from "./type";

class CashBookService {
  private storageService = storageSrevice;
  private databaseService = databaseService;

  async create(data: CreateCashBookDto): Promise<CashBookWithRelations> {
    const {
      file,
      receivedCheck,
      receivedCheckIds,
      customerId,
      ...cashBookData
    } = data;

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

      const result = await this.databaseService.$transaction(
        async (tx): Promise<CashBookWithRelations> => {
          const category = await tx.financialCategory.findUniqueOrThrow({
            where: {
              id: cashBookData.financialCategoryId,
            },
            select: {
              name: true,
            },
          });

          let receivedCheckId: string | undefined;
          const isCheckReceipt =
            category.name === "Recebimento de cheque de terceiro";

          if (isCheckReceipt && receivedCheck) {
            if (!customerId) {
              throw new Error(
                "É necessário informar o cliente para receber um cheque.",
              );
            }

            const createdCheck = await tx.receivedCheck.create({
              data: {
                checkNumber: receivedCheck.checkNumber,
                amount: receivedCheck.amount,
                agency: receivedCheck.agency,
                goodForAt: receivedCheck.goodForAt,
                notes: receivedCheck.notes,
                customer: {
                  connect: {
                    id: customerId,
                  },
                },
                bank: {
                  connect: {
                    id: receivedCheck.bankId,
                  },
                },
              },
            });

            receivedCheckId = createdCheck.id;
          }

          const cashBook = await tx.cashBook.create({
            data: {
              ...cashBookData,
              customerId: isCheckReceipt ? customerId : null,
              filePath: key,
              receivedCheckId,
            },
            include: {
              account: {
                select: {
                  balance: true,
                },
              },
              financialCategory: true,
            },
          } satisfies Prisma.CashBookCreateArgs);

          if (
            category.name === "Pagamento com cheque de terceiro" &&
            receivedCheckIds?.length
          ) {
            await tx.receivedCheck.updateMany({
              where: {
                id: {
                  in: receivedCheckIds,
                },
              },
              data: {
                status: ReceivedCheckStatus.FINALIZED,
              },
            });

            const payment = await tx.payment.create({
              data: {
                name: cashBook.title,
                amount: cashBook.value,
                receivedChecks: {
                  connect: receivedCheckIds.map((id) => ({ id })),
                },
                dueDate: cashBook.createdAt,
                paidAt: cashBook.createdAt,
                financialCategoryId: cashBook.financialCategoryId,
              },
            });
          }

          const isOut =
            cashBook.financialCategory.financialFlowType ===
            FinancialFlowType.OUT;

          await tx.account.update({
            where: {
              id: cashBook.accountId,
            },
            data: {
              balance: isOut
                ? { decrement: Number(cashBook.value) }
                : { increment: Number(cashBook.value) },
            },
          });

          return cashBook;
        },
      );

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
    const {
      id,
      file,
      receivedCheck: _receivedCheck,
      receivedCheckIds,
      ...cashBookData
    } = data;

    let newKey: string | null = null;
    let fileUploaded = false;

    try {
      const currentCashBook = await this.databaseService.cashBook.findUnique({
        where: { id },
        include: {
          financialCategory: true,
          receivedCheck: true,
        },
      });

      if (!currentCashBook) {
        throw new Error("Livro caixa não encontrado");
      }

      const oldKey = currentCashBook.filePath;

      if (
        currentCashBook.receivedCheck?.status ===
        ReceivedCheckStatus.FINALIZED
      ) {
        throw new Error(
          "Não é possível editar um lançamento vinculado a um cheque finalizado.",
        );
      }

      if (file) {
        const extension = file.name.split(".").pop();
        const date = new Date().toISOString().replace(/:/g, "-");

        newKey = `cash-book/${id}/extrato-${date}.${extension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        await this.storageService.upload(buffer, newKey, file.type);

        fileUploaded = true;
      }

      const result = await this.databaseService.$transaction(async (tx) => {
        const category = await tx.financialCategory.findUniqueOrThrow({
          where: {
            id:
              cashBookData.financialCategoryId ??
              currentCashBook.financialCategoryId,
          },
          select: {
            name: true,
            financialFlowType: true,
          },
        });

        if (
          category.name === "Pagamento com cheque de terceiro" &&
          receivedCheckIds?.length
        ) {
          const checks = await tx.receivedCheck.findMany({
            where: {
              id: {
                in: receivedCheckIds,
              },
            },
            select: {
              id: true,
              status: true,
            },
          });

          if (checks.length !== receivedCheckIds.length) {
            throw new Error(
              "Um ou mais cheques selecionados não foram encontrados.",
            );
          }

          if (
            checks.some(
              (check) => check.status === ReceivedCheckStatus.FINALIZED,
            )
          ) {
            throw new Error(
              "Não é possível utilizar cheques que já foram finalizados.",
            );
          }
        }

        const oldIsOut =
          currentCashBook.financialCategory.financialFlowType ===
          FinancialFlowType.OUT;

        await tx.account.update({
          where: {
            id: currentCashBook.accountId,
          },
          data: {
            balance: oldIsOut
              ? { increment: Number(currentCashBook.value) }
              : { decrement: Number(currentCashBook.value) },
          },
        });

        const isCheckReceipt =
          category.name === "Recebimento de cheque de terceiro";

        const cashBook = await tx.cashBook.update({
          where: {
            id,
          },
          data: {
            ...cashBookData,
            customerId: isCheckReceipt
              ? cashBookData.customerId ?? currentCashBook.customerId
              : null,
            ...(newKey && {
              filePath: newKey,
            }),
          },
        });

        await tx.account.update({
          where: {
            id: cashBook.accountId,
          },
          data: {
            balance:
              category.financialFlowType === FinancialFlowType.OUT
                ? { decrement: Number(cashBook.value) }
                : { increment: Number(cashBook.value) },
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

  async findCashBooks(
    params: CashBookParams,
  ): Promise<GetCashBookParamsDto> {
    const query = {
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: {
        account: {
          include: {
            bank: true,
          },
        },
        financialCategory: true,
        customer: true,
        receivedCheck: true,
      },
    } satisfies Prisma.CashBookFindManyArgs;

    const [count, cashBooks] = await this.databaseService.$transaction([
      this.databaseService.cashBook.count({
        where: query.where,
      }),
      this.databaseService.cashBook.findMany(query),
    ]);

    return {
      count,
      cashBook: cashBooks.map((item) => ({
        ...item,
        account: {
          ...item.account,
          balance: Number(item.account.balance),
        },
      })),
    };
  }
}

export const cashBookService = new CashBookService();
