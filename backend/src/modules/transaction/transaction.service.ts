import { Prisma } from "@/generated/prisma/browser";
import { transactionWhereInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { TransactionOptionParam } from "@/lib/types/params.type";
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "@/lib/types/transaction.type";
import { NotFoundError } from "@/lib/utils/error.utils";
import validationUtils from "@/lib/utils/validation.utils";

const defaultDate = (timeZone: string) => {
  const timezoneDate = new Date().toLocaleDateString("en-US", {
    timeZone,
  });
  const userDate = new Date(timezoneDate);
  const oneWeekAgo = Math.floor(
    (userDate.getTime() - 7 * 24 * 60 * 60 * 1000) / 1000,
  );

  const now = Math.floor(Date.now() / 1000);
  return [oneWeekAgo, now];
};

const transactionService = {
  // find by id
  async findById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.transaction.findUnique({
      where: {
        id,
        deletedAt: null,
        account: { id: accountId, user: { id: userId } },
      },
    });
  },

  // find all for data table
  async findAllForDataTable(
    option: TransactionOptionParam,
    accountId: string,
    userId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const userProfileData = await tx.profile.findUnique({
        where: { userId },
      });
      if (!userProfileData) throw new Error("profile not found!");

      const existingAccount = await tx.account.findUnique({
        where: { id: accountId },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");

      const [oneWeekAgo, now] = defaultDate(userProfileData.timezone);

      const {
        page = 1,
        search = "",
        type = "all",
        limit = 10,
        sortBy = "transactionAt",
        sortOrder = "asc",
        from_date = oneWeekAgo,
        to_date = now,
      } = option;

      const skip = (page - 1) * limit;

      const where: Prisma.transactionWhereInput = {
        accountId,
        deletedAt: null,
        transactionAt: { gte: from_date, lte: to_date },
        ...(type !== "all" && { type }),
        ...(search && {
          note: { contains: search, mode: "insensitive" },
        }),
      };

      const [transactionData, total] = await tx.$transaction([
        tx.transaction.findMany({
          select: {
            id: true,
            amount: true,
            type: true,
            note: true,
            transactionAt: true,
            category: { select: { name: true } },
            accountId: true,
            updatedAt: true,
          },
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        tx.transaction.count({ where }),
      ]);

      return {
        data: transactionData,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    });
  },

  // find all for chart
  async findAllForChart(
    option: TransactionOptionParam,
    accountId: string,
    userId: string,
  ) {
    validationUtils.requiredValue(userId, "user id");
    validationUtils.requiredValue(accountId, "account id");
    return await prisma.$transaction(async (tx) => {
      const userProfileData = await tx.profile.findUnique({
        where: { userId },
        select: { timezone: true },
      });
      if (!userProfileData) throw new NotFoundError("profile not found!");

      const existingAccount = await tx.account.findUnique({
        where: { id: accountId },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");

      const [oneWeekAgo, now] = defaultDate(userProfileData.timezone);

      const { from_date = oneWeekAgo, to_date = now } = option;

      return await tx.transaction.findMany({
        where: {
          account: { id: accountId },
          deletedAt: null,
          transactionAt: { gte: from_date, lte: to_date },
        },
        select: { amount: true, type: true, transactionAt: true },
        orderBy: {
          transactionAt: "asc",
        },
      });
    });
  },

  // create
  async create(dto: CreateTransactionDTO, accountId: string, userId: string) {
    validationUtils.requiredValue(accountId, "account id");
    return await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findUnique({
        where: { id: accountId, user: { id: userId } },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");

      const balanceUpdate =
        dto.type === "expense"
          ? existingAccount.balance.minus(dto.amount)
          : existingAccount.balance.plus(dto.amount);
      await tx.account.update({
        where: { id: existingAccount.id },
        data: { balance: balanceUpdate },
      });

      return tx.transaction.create({ data: { ...dto, accountId } });
    });
  },

  // update by id
  async updateById(
    dto: UpdateTransactionDTO,
    id: string,
    accountId: string,
    userId: string,
  ) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      const existingTransaction = await tx.transaction.findUnique({
        where: { id, account: { id: accountId, user: { id: userId } } },
      });
      if (!existingTransaction)
        throw new NotFoundError("transaction not found!");
      const existingAccount = await tx.account.findUnique({
        where: { id: accountId },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");

      let balanceUpdate = existingAccount.balance;
      const { amount: newAmount, type: newType } = dto;
      const { amount: oldAmount, type: oldType } = existingTransaction;

      // Step 1: Reverse transaksi lama, kita anggap transaction lama itu gak ada.
      if (oldType === "expense") {
        balanceUpdate = balanceUpdate.plus(oldAmount);
      } else {
        balanceUpdate = balanceUpdate.minus(oldAmount);
      }

      // Step 2: jika ada nilai baru, pakai nilai baru, kalau gak ada, pakai nilai lama.
      const effectiveType = newType ?? oldType;
      const effectiveAmount = newAmount ?? oldAmount;

      // step 3: baru di update, jika di pakek nilai lama keduanya, maka hasilnya sama seperti sebelumnya
      if (effectiveType === "expense") {
        balanceUpdate = balanceUpdate.minus(effectiveAmount);
      } else {
        balanceUpdate = balanceUpdate.plus(effectiveAmount);
      }

      const container: Prisma.transactionUpdateInput = {
        ...(dto.amount && { amount: dto.amount }),
        ...(dto.type && { type: dto.type }),
        ...(dto.transactionAt && { transactionAt: dto.transactionAt }),
        ...(dto.deletedAt && { deletedAt: dto.deletedAt }),
        ...(dto.note && { note: dto.note }),
        ...(dto.receiptUrl && { receiptUrl: dto.receiptUrl }),
      };

      await tx.account.update({
        where: { id: existingAccount.id },
        data: { balance: balanceUpdate },
      });

      return await tx.transaction.update({ where: { id }, data: container });
    });
  },

  // delete by id
  async deleteById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");

    await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findUnique({
        where: { id: accountId, user: { id: userId } },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");

      const userProfileData = await tx.profile.findUnique({
        where: { userId },
      });
      if (!userProfileData) throw new NotFoundError("profile not found!");

      const existingTransaction = await tx.transaction.findUnique({
        where: { id, account: { id: accountId, user: { id: userId } } },
      });
      if (!existingTransaction)
        throw new NotFoundError("transaction not found!");

      const { type, amount } = existingTransaction;
      const balanceUpdate =
        type === "expense"
          ? existingAccount.balance.plus(amount)
          : existingAccount.balance.minus(amount);

      await tx.account.update({
        where: { id: existingAccount.id },
        data: { balance: balanceUpdate },
      });

      const [_, now] = defaultDate(userProfileData.timezone);

      return await tx.transaction.update({
        where: { id },
        data: { deletedAt: now },
      });
    });
  },

  // restore transaction by id
  async restoreTransactionById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findUnique({
        where: { id: accountId, user: { id: userId } },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");

      const existingTransaction = await tx.transaction.findUnique({
        where: { id, account: { id: accountId, user: { id: userId } } },
      });

      if (!existingTransaction)
        throw new NotFoundError("transaction not found!");

      const { type, amount } = existingTransaction;
      const balanceUpdate =
        type === "expense"
          ? existingAccount.balance.minus(amount)
          : existingAccount.balance.plus(amount);

      await tx.account.update({
        where: { id: existingAccount.id },
        data: { balance: balanceUpdate },
      });

      return await tx.transaction.update({
        where: { id: existingTransaction.id },
        data: { deletedAt: null },
      });
    });
  },

  // delete permanent by id
  async deletePermanentById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");
    validationUtils.requiredValue(userId, "user id");

    await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findUnique({
        where: { id: accountId, user: { id: userId } },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");
      const existingTransaction = await tx.transaction.findUnique({
        where: { id, account: { id: accountId, user: { id: userId } } },
      });
      if (!existingTransaction)
        throw new NotFoundError("transaction not found!");
      if (!existingTransaction.deletedAt)
        throw new NotFoundError("transaction not ready to delete!");
      return await tx.transaction.delete({ where: { id } });
    });
  },
};

export default transactionService;
