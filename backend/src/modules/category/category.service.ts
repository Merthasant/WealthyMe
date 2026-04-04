import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/lib/types/category.type";
import { CategoryOptionParam } from "@/lib/types/params.type";
import { NotFoundError } from "@/lib/utils/error.utils";
import validationUtils from "@/lib/utils/validation.utils";

const categoryService = {
  // find by user id
  async findByUserId(option: CategoryOptionParam, userId: string) {
    validationUtils.requiredValue(userId, "user id");
    const {
      page = 1,
      limit = 50,
      search = "",
      sortBy = "updatedAt",
      sortOrder = "asc",
      type = "all",
    } = option;

    const skip = (page - 1) * limit;
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { id: userId } });
      if (!existingUser) throw new NotFoundError("user not found!");

      const where: Prisma.categoryWhereInput = { userId };
      if (search) {
        if (type !== "all") {
          where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { type: { equals: type } },
          ];
        } else {
          where.OR = [{ name: { contains: search, mode: "insensitive" } }];
        }
      }

      const [categoryData, total] = await tx.$transaction([
        tx.category.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        tx.category.count({ where }),
      ]);

      return {
        data: categoryData,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    });
  },

  // find by id
  async findById(id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { id: userId } });
      if (!existingUser) throw new NotFoundError("user not found!");

      const categoryData = await tx.category.findUnique({
        where: { id, user: { id: userId } },
      });
      if (!categoryData) throw new NotFoundError("category not found!");

      return categoryData;
    });
  },

  // create
  async create(dto: CreateCategoryDTO, userId: string) {
    validationUtils.requiredValue(userId, "user id");
    validationUtils.isTransactionType(dto.type);

    return await prisma.category.create({
      data: { ...dto, user: { connect: { id: userId } } },
    });
  },

  // update by id
  async updateById(dto: UpdateCategoryDTO, id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");
    if (dto.type) validationUtils.isTransactionType(dto.type);
    return await prisma.$transaction(async (tx) => {
      const existingCategory = await tx.category.findUnique({
        where: { id, user: { id: userId } },
      });
      if (!existingCategory) throw new NotFoundError("category not found!");

      const container: Prisma.categoryUpdateInput = {
        ...(dto.name && { name: dto.name }),
        ...(dto.type && { type: dto.type }),
      };

      return await tx.category.update({
        where: { id: existingCategory.id },
        data: container,
      });
    });
  },

  // delete by id
  async deleteById(id: string, userId: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(userId, "user id");

    return await prisma.$transaction(async (tx) => {
      const existingCategory = await tx.category.findUnique({
        where: { id, user: { id: userId } },
      });
      if (!existingCategory) throw new NotFoundError("category not found!");

      return await tx.category.delete({ where: { id: existingCategory.id } });
    });
  },
};

export default categoryService;
