import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { BaseOptionParams } from "@/lib/types/params.type";
import { CreateUserDTO, UpdateUserDTO } from "@/lib/types/user.type.js";
import { NotFoundError, ValidationError } from "@/lib/utils/error.utils.js";
import { createLogger } from "@/lib/utils/log.utils";
import validationUtils from "@/lib/utils/validation.utils.js";
import argon2 from "argon2";

const log = createLogger({ service: "user-service" });

const userSelectExcPass: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  role: true,
};

const userSelectIncPass: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
  role: true,
};

const userService = {
  // find all
  async findAll(option: BaseOptionParams) {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "updatedAt",
      sortOrder = "asc",
    } = option;
    const skip = (page - 1) * limit;

    log.info({ option, skip }, "Finding all users with options");

    const where: Prisma.UserWhereInput = {};
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
        orderBy: [
          {
            [sortBy]: sortOrder,
          },
          { id: sortOrder },
        ],
      }),
      prisma.user.count({ where }),
    ]);

    log.info({ userData, total }, "Users retrieved successfully");

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
    log.info({ userId: id }, "Finding user by ID");
    validationUtils.requiredValue(id, "id");
    const userData = await prisma.user.findUnique({
      where: { id },
      select: userSelectIncPass,
    });
    log.info({ userData }, "User data retrieved");
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return userData;
  },

  // find by id exclude password
  async findByIdExcPass(id: string) {
    log.info({ userId: id }, "Finding user by ID (excluding password)");
    validationUtils.requiredValue(id, "id");
    const userData = await prisma.user.findUnique({
      where: { id },
      select: userSelectExcPass,
    });
    log.info({ userData }, "User data retrieved (excluding password)");
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return userData;
  },

  // find by email
  async findByEmail(email: string) {
    log.info({ email }, "Finding user by email");
    validationUtils.requiredValue(email, "email");
    const userData = await prisma.user.findUnique({
      where: { email },
      select: userSelectIncPass,
    });
    log.info({ userData }, "User data retrieved by email");
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return userData;
  },

  // find by email exclude password
  async findByEmailExcPass(email: string) {
    log.info({ email }, "Finding user by email (excluding password)");
    validationUtils.requiredValue(email, "email");
    const userData = await prisma.user.findUnique({
      where: { email },
      select: userSelectExcPass,
    });
    log.info({ userData }, "User data retrieved by email (excluding password)");
    // validation user
    if (!userData) throw new NotFoundError("user not found!");

    return userData;
  },

  // create
  async create(DTO: CreateUserDTO) {
    log.info({ DTO }, "Creating new user");

    const { name, email, password, confPassword, role } = DTO;
    validationUtils.matchingPassword(password, confPassword);

    return await prisma.$transaction(async (tx) => {
      // exist email
      const existingEmail = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });
      log.info({ existingEmail }, "Checking if email already exists");
      // validation email is exist
      if (existingEmail) throw new ValidationError("email is exist!");
      // hash passsword
      const hashed = await argon2.hash(password);
      log.info({ hashed }, "Password hashed successfully");

      const createUserData = await tx.user.create({
        data: {
          name,
          email,
          password: hashed,
          role,
        },
        select: userSelectExcPass,
      });
      log.info({ createUserData }, "New user created");
      return createUserData;
    });
  },

  // update by id
  async updateById(id: string, DTO: UpdateUserDTO) {
    log.info({ userId: id, DTO }, "Updating user by ID");
    validationUtils.requiredValue(id, "id");
    return await prisma.$transaction(async (tx) => {
      const { name, email, password, confPassword, role } = DTO;
      const existingUser = await tx.user.findUnique({
        where: { id },
        select: { id: true },
      });
      log.info({ existingUser }, "Checking if user exists");
      if (!existingUser) throw new NotFoundError("user not found");
      let hashed: string | undefined = undefined;
      if (password) {
        if (!confPassword)
          throw new ValidationError("confirm password is required");
        validationUtils.matchingPassword(password, confPassword);
        hashed = await argon2.hash(password);
        log.info({ hashed }, "Password hashed successfully");
      }

      const userUpdateInput: Prisma.UserUpdateInput = {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(hashed !== undefined && { password: hashed }),
        ...(role !== undefined && { role }),
      };

      log.info({ userUpdateInput }, "User update input prepared");

      return await tx.user.update({
        data: userUpdateInput,
        where: { id },
        select: userSelectExcPass,
      });
    });
  },

  // delete by id
  async deleteById(id: string) {
    log.info({ userId: id }, "Deleting user by ID");
    validationUtils.requiredValue(id, "id");
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existingUser) throw new NotFoundError("user not found");
      log.info({ existingUser }, "User exists and will be deleted");
      return await tx.user.delete({ where: { id }, select: userSelectExcPass });
    });
  },
};

export default userService;
