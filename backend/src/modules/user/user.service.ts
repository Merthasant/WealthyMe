import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { OptionParam } from "@/lib/types/params.type.js";
import { CreateUserDTO, UpdateUserDTO } from "@/lib/types/user.type.js";
import { NotFoundError, ValidationError } from "@/lib/utils/error.utils.js";
import validationUtils from "@/lib/utils/validation.utils.js";
import argon2 from "argon2";

const userSelectExcPass: Prisma.userSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  role: {
    select: {
      name: true,
    },
  },
};

const userSelectIncPass: Prisma.userSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
  role: {
    select: {
      name: true,
    },
  },
};

const userService = {
  // find all
  async findAll(option: OptionParam) {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "updatedAt",
      sortOrder = "asc",
    } = option;
    const skip = (page - 1) * limit;

    const where: Prisma.userWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [userData, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: userSelectExcPass,
        take: limit,
        skip,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: userData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // find by id
  async findById(id: string) {
    validationUtils.requiredValue(id, "id");
    const userData = await prisma.user.findUnique({
      where: { id },
      select: userSelectIncPass,
    });
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return userData;
  },

  // find by id exclude password
  async findByIdExcPass(id: string) {
    validationUtils.requiredValue(id, "id");
    const userData = await prisma.user.findUnique({
      where: { id },
      select: userSelectExcPass,
    });
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return userData;
  },

  // find by email
  async findByEmail(email: string) {
    validationUtils.requiredValue(email, "email");
    const userData = await prisma.user.findUnique({
      where: { email },
      select: userSelectIncPass,
    });
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return userData;
  },

  // find by email exclude password
  async findByEmailExcPass(email: string) {
    validationUtils.requiredValue(email, "email");
    const userData = await prisma.user.findUnique({
      where: { email },
      select: userSelectExcPass,
    });
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return;
  },

  // create
  async create(DTO: CreateUserDTO) {
    const { name, email, password, confPassword, role } = DTO;
    validationUtils.matchingPassword(password, confPassword);

    return await prisma.$transaction(async (tx) => {
      // exist email
      const existingEmail = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });
      // validation email is exist
      if (existingEmail) throw new ValidationError("email is exist!");
      // hash passsword
      const hashed = await argon2.hash(password);

      const createUserData = await tx.user.create({
        data: {
          name,
          email,
          password: hashed,
          role: { create: { name: role } },
        },
        select: userSelectExcPass,
      });

      return createUserData;
    });
  },

  // update by id
  async updateById(id: string, DTO: UpdateUserDTO) {
    validationUtils.requiredValue(id, "id");
    return await prisma.$transaction(async (tx) => {
      const { name, email, password, confPassword, role } = DTO;
      const existingUser = await tx.user.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existingUser) throw new NotFoundError("user not found");
      let hashed: string | undefined = undefined;
      if (password) {
        if (!confPassword)
          throw new ValidationError("confirm password is required");
        validationUtils.matchingPassword(password, confPassword);
        hashed = await argon2.hash(password);
      }

      const userUpdateInput: Prisma.userUpdateInput = {
        ...(name && { name }),
        ...(email && { email }),
        ...(hashed && { password: hashed }),
        ...(role && { role: { update: { name: role } } }),
      };

      return await tx.user.update({
        data: userUpdateInput,
        where: { id },
        select: userSelectExcPass,
      });
    });
  },

  // delete by id
  async deleteById(id: string) {
    validationUtils.requiredValue(id, "id");
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existingUser) throw new NotFoundError("user not found");
      return await tx.user.delete({ where: { id }, select: userSelectExcPass });
    });
  },
};

export default userService;
