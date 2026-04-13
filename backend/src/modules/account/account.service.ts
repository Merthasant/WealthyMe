import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { CreateAccountDTO, UpdateAccountDTO } from "@/lib/types/account.type";
import { AccountOptionParam } from "@/lib/types/params.type";
import { NotFoundError } from "@/lib/utils/error.utils";
import validationUtils from "@/lib/utils/validation.utils";

const accountSelect: Prisma.accountSelect = {
  id: true,
  name: true,
  balance: true,
  type: true,
  currency_code: true,
  createdAt: true,
  updatedAt: true,
};

const accountService = {
  // find by id
  async findById(id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      // get user dan account dengan 1 query
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          accounts: { where: { id }, select: accountSelect },
        },
      });
      // validation user
      if (!userData) throw new NotFoundError("user not found!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      return accountData;
    });
  },

  // find all
  async findAll(options: AccountOptionParam, userId: string) {
    validationUtils.requiredValue(userId, "user id");
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "updatedAt",
      sortOrder = "asc",
      type = undefined,
    } = options;

    const skip = (page - 1) * limit;

    return await prisma.$transaction(async (tx) => {
      const where: Prisma.accountWhereInput = { user: { id: userId } };
      if (search) {
        if (type !== "all")
          where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { type: { equals: type } },
          ];
        else where.OR = [{ name: { contains: search, mode: "insensitive" } }];
      }

      const [userData, total] = await tx.$transaction([
        tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            accounts: {
              where,
              skip,
              take: limit,
              orderBy: { [sortBy]: sortOrder },
              select: accountSelect,
            },
          },
        }),
        tx.account.count({ where }),
      ]);

      // validation user
      if (!userData) throw new NotFoundError("user not found!");

      const accountData = userData.accounts;

      return {
        data: accountData,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    });
  },

  // create
  async create(dto: CreateAccountDTO, userId: string) {
    validationUtils.requiredValue(userId, "user id");
    const { balance = 0, ...data } = dto;

    return await prisma.$transaction(async (tx) => {
      // validation user
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!userData) throw new NotFoundError("user not found!");

      return await tx.account.create({
        data: { ...data, balance, user: { connect: { id: userData.id } } },
        select: accountSelect,
      });
    });
  },

  // update
  async updateById(dto: UpdateAccountDTO, userId: string, id: string) {
    validationUtils.requiredValue(userId, "user id");
    validationUtils.requiredValue(id, "id");
    return await prisma.$transaction(async (tx) => {
      // get user dan account dengan 1 query
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          accounts: { where: { id }, select: { id: true } },
        },
      });
      // validation user
      if (!userData) throw new NotFoundError("user not found!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      const container: Prisma.accountUpdateInput = {
        ...(dto.name && { name: dto.name }),
        ...(dto.type && { type: dto.type }),
        ...(dto.balance && { balance: dto.balance }),
      };

      return await tx.account.update({
        where: { id: accountData.id, user: { id: userData.id } },
        data: container,
      });
    });
  },

  // delete
  async deleteById(userId: string, id: string) {
    validationUtils.requiredValue(userId, "user id");
    validationUtils.requiredValue(id, "id");

    return await prisma.$transaction(async (tx) => {
      // get user dan account dengan 1 query
      const userData = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          accounts: { where: { id }, select: { id: true } },
        },
      });
      // validation user
      if (!userData) throw new NotFoundError("user not found!");

      // validation account
      const accountData = userData.accounts[0];
      if (!accountData)
        throw new NotFoundError("account on this user is not found!");

      return await tx.account.delete({
        where: { id: accountData.id, user: { id: userData.id } },
      });
    });
  },
};

export default accountService;
