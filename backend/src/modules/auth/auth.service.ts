import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/utils/error.utils";
import jwtUtils from "@/lib/utils/jwt.utils";
import validationUtils from "@/lib/utils/validation.utils";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { AuthOutput } from "@/lib/types/auth.type";
import { CreateUserDTO } from "@/lib/types/user.type";
import { Prisma } from "@/generated/prisma/browser";

const authService = {
  // create access token
  createAccessToken(id: string, role: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(role, "role");
    return jwt.sign({ id, role }, jwtUtils.getAccessSecret(), {
      expiresIn: "15m",
    });
  },

  // create refresh token
  createRefreshToken(id: string, email: string, role: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(email, "email");
    validationUtils.requiredValue(role, "role");
    return jwt.sign({ id, email, role }, jwtUtils.getRefreshSecret(), {
      expiresIn: "7d",
    });
  },

  // verify access token
  verifyAccessToken(token: string) {
    validationUtils.requiredValue(token, "token");
    return jwt.verify(token, jwtUtils.getAccessSecret());
  },

  // verify refresh token
  verifyRefreshToken(token: string) {
    validationUtils.requiredValue(token, "token");
    return jwt.verify(token, jwtUtils.getRefreshSecret());
  },

  // add refresh token
  async addRefreshToken(token: string, userId: string, device: string) {
    validationUtils.requiredValue(token, "token");
    validationUtils.requiredValue(userId, "user id");

    await prisma.refreshToken.create({
      data: {
        device,
        token,
        isRevoked: false,
        user: { connect: { id: userId } },
        expiredAt: new Date(Date.now() + jwtUtils.refreshExpiresInMiliSeconds),
      },
    });
  },

  async unplugRefreshToken(
    refreshToken: string,
    userId: string,
    device: string,
    tx: Prisma.TransactionClient,
  ) {
    const existingRefreshToken = await tx.refreshToken.findFirst({
      where: {
        token: refreshToken,
        user: { id: userId },
        device,
      },
    });
    if (!existingRefreshToken)
      throw new NotFoundError("refresh token is not found!");
    await tx.refreshToken.update({
      where: { id: existingRefreshToken.id },
      data: { isRevoked: true },
    });
  },

  // login
  async login(email: string, passwrod: string) {
    validationUtils.requiredValue(email, "email");
    validationUtils.requiredValue(passwrod, "password");
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
        include: { role: true },
      });
      if (!existingUser) throw new NotFoundError("user not found!");
      const matchPass = await argon2.verify(passwrod, existingUser.password);
      const role: "admin" | "user" | undefined = existingUser.role?.name;
      if (!role) throw new ValidationError("user don't have a role!");
      if (!matchPass) throw new ValidationError("password not match!");
      const accessToken = authService.createAccessToken(existingUser.id, role);
      const refreshToken = authService.createRefreshToken(
        existingUser.id,
        email,
        role,
      );
      const { password: _, createdAt: __, role: ___, ...data } = existingUser;
      const container: AuthOutput = {
        ...data,
        role,
        token: {
          accessToken,
          refreshToken,
        },
      };
      return container;
    });
  },

  // register
  async register(dto: CreateUserDTO) {
    const { name, email, password, confPassword, role } = dto;
    validationUtils.requiredValue(name, "name");
    validationUtils.requiredValue(email, "email");
    validationUtils.requiredValue(password, "password");
    validationUtils.requiredValue(confPassword, "confirm password");
    validationUtils.requiredValue(role, "role");
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new ValidationError("email is exis!");
      validationUtils.matchingPassword(password, confPassword);
      const hashed = await argon2.hash(password);
      const createUser = await tx.user.create({
        data: { name, email, password: hashed },
      });

      const createRole = await tx.role.create({
        data: { name: role, user: { connect: { id: createUser.id } } },
      });

      const accessToken = authService.createAccessToken(
        createUser.id,
        createRole.name,
      );
      const refreshToken = authService.createRefreshToken(
        createUser.id,
        email,
        createRole.name,
      );

      const { password: _, createdAt: __, ...data } = createUser;
      const container: AuthOutput = {
        ...data,
        role: createRole.name,
        token: {
          accessToken,
          refreshToken,
        },
      };

      return container;
    });
  },

  // logout
  async logout(refreshToken: string, userId: string, device: string) {
    validationUtils.requiredValue(refreshToken, "refresh token");
    validationUtils.requiredValue(userId, "user id");
    validationUtils.requiredValue(device, "device");

    await prisma.$transaction(async (tx) => {
      this.unplugRefreshToken(refreshToken, userId, device, tx);
    });
  },
};
