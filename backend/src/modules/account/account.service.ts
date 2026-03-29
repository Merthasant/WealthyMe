import {
  accountUpdateInput,
  accountWhereInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { CreateAccountDTO, UpdateAccountDTO } from "@/lib/types/account.type";
import { AccountOptionParam } from "@/lib/types/params.type";
import { NotFoundError } from "@/lib/utils/error.utils";
import validationUtils from "@/lib/utils/validation.utils";

const accountService = {
  // find by id
  async findById(id: string) {
    validationUtils.requiredValue(id, "id");
    return await prisma.account.findUnique({ where: { id } });
  },

  // find all
  async findAll(options: AccountOptionParam, userId: string) {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "updatedAt",
      sortOrder = "asc",
      type = undefined,
    } = options;

    const skip = (page - 1) * limit;
    const where: accountWhereInput = { user: { id: userId } };
    if (search) {
      if (type !== "all")
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { type: { equals: type } },
        ];
      else where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const [accoundData, total] = await prisma.$transaction([
      prisma.account.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.account.count({ where }),
    ]);

    return {
      data: accoundData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // create
  async create(dto: CreateAccountDTO, userId: string) {
    validationUtils.requiredValue(userId, "user id");
    const { balance = 0, ...data } = dto;
    return await prisma.account.create({
      data: { ...data, balance, user: { connect: { id: userId } } },
    });
  },

  // update
  async updateById(dto: UpdateAccountDTO, userId: string, id: string) {
    validationUtils.requiredValue(userId, "user id");
    validationUtils.requiredValue(id, "id");
    return await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findUnique({
        where: { id, user: { id: userId } },
      });
      if (!existingAccount)
        throw new NotFoundError(
          "account not found or this account is not your's!",
        );
      const container: accountUpdateInput = {
        ...(dto.name && { name: dto.name }),
        ...(dto.type && { type: dto.type }),
        ...(dto.balance && { balance: dto.balance }),
      };
      return await tx.account.update({
        where: { id, user: { id: userId } },
        data: container,
      });
    });
  },

  // delete
  async deleteById(userId: string, id: string) {
    validationUtils.requiredValue(userId, "user id");
    validationUtils.requiredValue(id, "id");
    return await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findUnique({
        where: { id, user: { id: userId } },
      });
      if (!existingAccount) throw new NotFoundError("account not found!");
      return await tx.account.delete({ where: { id, user: { id: userId } } });
    });
  },
};

export default accountService;
