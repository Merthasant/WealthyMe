import { prisma } from "@/lib/prisma";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "@/lib/utils/error.utils";
import jwtUtils from "@/lib/utils/jwt.utils";
import validationUtils from "@/lib/utils/validation.utils";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { AuthOutput } from "@/lib/types/auth.type";
import { CreateUserDTO } from "@/lib/types/user.type";
import { createLogger } from "@/lib/utils/log.utils";
import { date } from "zod";

const log = createLogger({ service: "auth-service" });

const authService = {
  // create access token
  createAccessToken(id: string, role: string) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(role, "role");
    log.info({ id, role }, "Creating access token");
    return jwt.sign({ id, role }, jwtUtils.getAccessSecret(), {
      expiresIn: "15m",
    });
  },

  // create refresh token
  async createRefreshToken(
    id: string,
    email: string,
    role: string,
    device: string,
  ) {
    validationUtils.requiredValue(id, "id");
    validationUtils.requiredValue(email, "email");
    validationUtils.requiredValue(role, "role");
    validationUtils.requiredValue(device, "device");
    log.info({ id, email, role }, "Creating refresh token");
    const refreshToken = jwt.sign(
      { id, email, role },
      jwtUtils.getRefreshSecret(),
      {
        expiresIn: "7d",
      },
    );

    const hashedRefreshToken = await argon2.hash(refreshToken);
    log.info({ hashedRefreshToken }, "Hashed refresh token created");

    const storeRefreshToken = await prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        device,
        user: { connect: { id } },
        expiredAt: Date.now() + jwtUtils.accessExpiresInMiliSeconds,
      },
    });

    log.info({ storeRefreshToken }, "Refresh token stored");
    return `${storeRefreshToken.id}.${refreshToken}`;
  },

  parseRefreshToken(raw: string) {
    const sep = raw.indexOf(".");

    return {
      id: raw.slice(0, sep), // UUID, sebelum titik pertama
      secret: raw.slice(sep + 1), // seluruh sisanya, termasuk titik-titik JWT
    };
  },

  // verify access token
  verifyAccessToken(token: string) {
    validationUtils.requiredValue(token, "token");
    log.info({ token }, "Verifying access token");
    return jwt.verify(token, jwtUtils.getAccessSecret());
  },

  // verify refresh token
  verifyRefreshToken(token: string) {
    validationUtils.requiredValue(token, "token");
    log.info({ token }, "Verifying refresh token");
    const { id, secret } = this.parseRefreshToken(token);
    log.info(
      { refreshToken: secret },
      "Extracted refresh token for verification",
    );
    return jwt.verify(secret, jwtUtils.getRefreshSecret());
  },

  async getRefreshToken(token: string, device: string) {
    validationUtils.requiredValue(token, "token");
    validationUtils.requiredValue(device, "device");
    log.info({ refreshToken: token, device }, "Retrieving refresh token");
    const { id, secret } = this.parseRefreshToken(token);
    log.info(
      { id, refreshToken: secret, device },
      "Parsed refresh token components",
    );
    const tokenData = await prisma.refreshToken.findUnique({
      where: { id, device },
    });

    if (!tokenData?.tokenHash)
      throw new BadRequestError("token data is empty!");

    const isMatch = await argon2.verify(tokenData?.tokenHash, secret);
    if (!isMatch) throw new ValidationError("refresh token not match!");

    return tokenData;
  },

  async revokedRefreshToken(token: string) {
    validationUtils.requiredValue(token, "token");
    log.info({ token }, "Revoking refresh token");

    const { id, secret } = this.parseRefreshToken(token);
    log.info(
      { id, refreshToken: secret },
      "Parsed refresh token components for revocation",
    );

    await prisma.$transaction(async (tx) => {
      const existingRefreshToken = await tx.refreshToken.findUnique({
        where: { id },
        select: { id: true, tokenHash: true },
      });
      if (!existingRefreshToken)
        throw new NotFoundError("refresh token not found!");
      log.info({ existingRefreshToken }, "Existing refresh token found");
      const isMatch = await argon2.verify(
        existingRefreshToken.tokenHash,
        secret,
      );
      if (!isMatch) throw new ValidationError("refresh token not match!");
      await tx.refreshToken.update({
        where: { id: existingRefreshToken.id },
        data: { isRevoked: true },
      });
    });
  },

  // login
  async login(email: string, passwrod: string, device: string) {
    validationUtils.requiredValue(email, "email");
    validationUtils.requiredValue(passwrod, "password");
    validationUtils.requiredValue(device, "device");
    log.info({ email }, "Attempting to login user");
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
      });
      if (!existingUser) throw new NotFoundError("user not found!");
      log.info({ existingUser }, "Existing user found for login");
      const matchPass = await argon2.verify(existingUser.password, passwrod);
      log.info({ matchPass }, "Password verification result");
      if (!matchPass) throw new ValidationError("password not match!");
      const accessToken = authService.createAccessToken(
        existingUser.id,
        existingUser.role,
      );
      const refreshToken = await authService.createRefreshToken(
        existingUser.id,
        email,
        existingUser.role,
        device,
      );
      const { password: _, ...data } = existingUser;
      const container: AuthOutput = {
        ...data,
        token: {
          accessToken,
          refreshToken,
        },
      };
      log.info({ container }, "Login successful");
      return container;
    });
  },

  // register
  async register(dto: CreateUserDTO, device: string) {
    const { name, email, password, confPassword, role } = dto;
    validationUtils.requiredValue(name, "name");
    validationUtils.requiredValue(email, "email");
    validationUtils.requiredValue(password, "password");
    validationUtils.requiredValue(confPassword, "confirm password");
    validationUtils.requiredValue(role, "role");
    log.info(
      { name, email, password, confPassword, role },
      "Attempting to register new user",
    );
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new ValidationError("email is exis!");
      validationUtils.matchingPassword(password, confPassword);
      const hashed = await argon2.hash(password);
      const createUser = await tx.user.create({
        data: { name, email, password: hashed, role },
      });
      log.info({ createUser }, "New user created");

      const accessToken = authService.createAccessToken(
        createUser.id,
        createUser.role,
      );
      const refreshToken = await authService.createRefreshToken(
        createUser.id,
        createUser.email,
        createUser.role,
        device,
      );

      const { password: _, ...data } = createUser;
      const container: AuthOutput = {
        ...data,
        token: {
          accessToken,
          refreshToken,
        },
      };
      log.info({ container }, "User registration successful");
      return container;
    });
  },

  // logout
  async logout(refreshToken: string, userId: string, device: string) {
    validationUtils.requiredValue(refreshToken, "refresh token");
    validationUtils.requiredValue(userId, "user id");
    validationUtils.requiredValue(device, "device");

    log.info(
      { refreshToken, userId, device },
      "Attempting to logout user and revoke refresh token",
    );

    const tokenHash = await argon2.hash(refreshToken);

    log.info(
      { tokenHash, userId, device },
      "Searching for existing refresh token to revoke",
    );

    await prisma.$transaction(async (tx) => {
      const existingRefreshToken = await tx.refreshToken.findUnique({
        where: {
          tokenHash,
          userId,
          device,
        },
      });
      if (!existingRefreshToken)
        throw new NotFoundError("refresh token is not found!");
      log.info(
        { existingRefreshToken },
        "Existing refresh token found for revocation",
      );
      await tx.refreshToken.update({
        where: { id: existingRefreshToken.id },
        data: { isRevoked: true },
      });
    });
  },
};

export default authService;
