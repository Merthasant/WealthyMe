import { Prisma } from "@/generated/prisma/browser";
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

const transactionSelect: Prisma.transactionSelect = {
  id: true,
  amount: true,
  category: { select: { name: true } },
  type: true,
  transactionAt: true,
  note: true,
  currency_code: true,
  receiptUrl: true,
  createdAt: true,
  updatedAt: true,
};

const transactionService = {
  // find by id
  async findById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");
    validationUtils.requiredValue(userId, "user id");

    const transactionData = await prisma.transaction.findUnique({
      where: {
        id,
        deletedAt: null,
        account: { id: accountId, user: { id: userId } },
      },
      select: transactionSelect,
    });
    if (!transactionData) throw new NotFoundError("transaction not found!");
    return transactionData;
  },

  // find all for data table
  async findAllForDataTable(
    option: TransactionOptionParam,
    accountId: string,
    userId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      // existing user, profile dan account dengan 1 query
      const userData = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          profile: { where: { userId }, select: { timezone: true } },
          accounts: { where: { id: accountId }, select: { id: true } },
        },
      });
      // validtaion user
      if (!userData) throw new NotFoundError("user not found!");

      // validation profile
      const profileData = userData.profile;
      if (!profileData)
        throw new NotFoundError("this user don't have a profile!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      const [oneWeekAgo, now] = defaultDate(profileData.timezone);

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
          select: transactionSelect,
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
      // existing user, profile dan account dengan 1 query
      const userData = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          profile: { where: { userId }, select: { timezone: true } },
          accounts: { where: { id: accountId }, select: { id: true } },
        },
      });
      // validtaion user
      if (!userData) throw new NotFoundError("user not found!");

      // validation profile
      const profileData = userData.profile;
      if (!profileData)
        throw new NotFoundError("this user don't have a profile!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      const [oneWeekAgo, now] = defaultDate(profileData.timezone);

      const { from_date = oneWeekAgo, to_date = now } = option;

      return await tx.transaction.findMany({
        where: {
          account: { id: accountId },
          deletedAt: null,
          transactionAt: { gte: from_date, lte: to_date },
        },
        select: {
          amount: true,
          type: true,
          currency_code: true,
          transactionAt: true,
        },
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
      // existing user dan account dengan 1 query
      const userData = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          accounts: {
            where: { id: accountId },
            select: { id: true, balance: true },
          },
        },
      });
      // validtaion user
      if (!userData) throw new NotFoundError("user not found!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      const balanceUpdate =
        dto.type === "expense"
          ? accountData.balance.minus(dto.amount)
          : accountData.balance.plus(dto.amount);
      await tx.account.update({
        where: { id: accountData.id },
        data: { balance: balanceUpdate },
      });

      return tx.transaction.create({
        data: { ...dto, accountId },
        select: transactionSelect,
      });
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
      // existing user, account dan transaction dengan 1 query
      const userData = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          accounts: {
            where: { id: accountId },
            select: {
              id: true,
              balance: true,
              transactions: {
                where: { id },
                select: { amount: true, type: true },
              },
            },
          },
        },
      });
      // validtaion user
      if (!userData) throw new NotFoundError("user not found!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      // validation transaction
      const transactionData = accountData.transactions[0];
      if (!transactionData)
        throw new NotFoundError("transaction on this account is not found!");

      let balanceUpdate = accountData.balance;
      const { amount: newAmount, type: newType } = dto;
      const { amount: oldAmount, type: oldType } = transactionData;

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
        where: { id: accountData.id },
        data: { balance: balanceUpdate },
      });

      return await tx.transaction.update({
        where: { id },
        data: container,
        select: transactionSelect,
      });
    });
  },

  // delete by id
  async deleteById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");

    return await prisma.$transaction(async (tx) => {
      // existing user, profile dan account dengan 1 query
      const userData = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          profile: { where: { userId }, select: { timezone: true } },
          accounts: {
            where: { id: accountId },
            select: {
              id: true,
              balance: true,
              transactions: {
                where: { id },
                select: { amount: true, type: true },
              },
            },
          },
        },
      });
      // validtaion user
      if (!userData) throw new NotFoundError("user not found!");

      // validation profile
      const profileData = userData.profile;
      if (!profileData)
        throw new NotFoundError("this user don't have a profile!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      // validation transaction
      const transactionData = accountData.transactions[0];
      if (!transactionData)
        throw new NotFoundError("transaction on this account is not found!");

      const { type, amount } = transactionData;
      const balanceUpdate =
        type === "expense"
          ? accountData.balance.plus(amount)
          : accountData.balance.minus(amount);

      await tx.account.update({
        where: { id: accountData.id },
        data: { balance: balanceUpdate },
      });

      const [_, now] = defaultDate(profileData.timezone);

      return await tx.transaction.update({
        where: { id },
        data: { deletedAt: now },
        select: transactionSelect,
      });
    });
  },

  // restore transaction by id
  async restoreTransactionById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      // existing user, account dan transaction dengan 1 query
      const userData = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          accounts: {
            where: { id: accountId },
            select: {
              id: true,
              balance: true,
              transactions: {
                where: { id },
                select: { id: true, amount: true, type: true },
              },
            },
          },
        },
      });
      // validtaion user
      if (!userData) throw new NotFoundError("user not found!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      // validation transaction
      const transactionData = accountData.transactions[0];
      if (!transactionData)
        throw new NotFoundError("transaction on this account is not found!");

      const { type, amount } = transactionData;
      const balanceUpdate =
        type === "expense"
          ? accountData.balance.minus(amount)
          : accountData.balance.plus(amount);

      await tx.account.update({
        where: { id: accountData.id },
        data: { balance: balanceUpdate },
      });

      return await tx.transaction.update({
        where: { id: transactionData.id },
        data: { deletedAt: null },
        select: transactionSelect,
      });
    });
  },

  // delete permanent by id
  async deletePermanentById(id: string, accountId: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(accountId, "account id");
    validationUtils.requiredValue(userId, "user id");

    await prisma.$transaction(async (tx) => {
      // existing user, account dan transaction dengan 1 query
      const userData = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          accounts: {
            where: { id: accountId },
            select: {
              id: true,
              balance: true,
              transactions: {
                where: { id },
                select: { id: true, deletedAt: true },
              },
            },
          },
        },
      });
      // validtaion user
      if (!userData) throw new NotFoundError("user not found!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      // validation transaction
      const transactionData = accountData.transactions[0];
      if (!transactionData)
        throw new NotFoundError("transaction on this account is not found!");

      if (!transactionData.deletedAt)
        throw new NotFoundError("transaction not ready to delete!");
      return await tx.transaction.delete({
        where: { id: transactionData.id },
        select: transactionSelect,
      });
    });
  },
};

export default transactionService;
