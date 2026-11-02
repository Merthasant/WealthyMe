import "dotenv/config";
import { catchAllErrors } from "@/lib/utils/error.utils";
import jwtUtils from "@/lib/utils/jwt.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import authService from "./auth.service";
import userService from "../user/user.service";
import { LoginDTO, RegisterDTO } from "@/lib/types/auth.type";
import jwt from "jsonwebtoken";
import { createLogger } from "@/lib/utils/log.utils";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

const log = createLogger({ service: "auth-controller" });

const authController = {
  setRefreshTokenInCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: jwtUtils.refreshExpiresInMiliSeconds,
    });
    log.info({ refreshToken }, "Refresh token set in cookie");
  },

  async login(req: Request, res: Response) {
    req.log.info({ body: req.validatedBody }, "Received request to login");
    const { email, password } = req.validatedBody as LoginDTO;
    if (!email || !password)
      return responseUtils.error(res, 400, "email or password is required!");
    const device = req.headers["user-agent"] ?? "unknown";
    log.info({ email, device }, "Attempting to log in user");
    try {
      const loginData = await authService.login(email, password, device);
      const { token, ...data } = loginData;
      const { accessToken, refreshToken } = token;
      authController.setRefreshTokenInCookie(res, refreshToken);
      log.info({ userId: data.id }, "User logged in successfully");
      return responseUtils.success(res, 200, "user login successfully", {
        ...data,
        token: { accessToken },
      });
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  async register(req: Request, res: Response) {
    req.log.info({ body: req.validatedBody }, "Received request to register");
    const { name, email, password, confPassword, role } =
      req.validatedBody as RegisterDTO;
    if (!name || !email || !password || !confPassword || !role)
      return responseUtils.error(res, 400, "email or password is required!");
    const device = req.headers["user-agent"] ?? "unknown";
    log.info({ name, email, role, device }, "Attempting to register user");
    try {
      const registerData = await authService.register(
        {
          name,
          email,
          password,
          confPassword,
          role,
        },
        device,
      );
      const { token, ...data } = registerData;
      const { accessToken, refreshToken } = token;
      authController.setRefreshTokenInCookie(res, refreshToken);
      log.info({ userId: data.id }, "User registered successfully");
      return responseUtils.success(res, 200, "user register successfully", {
        ...data,
        token: { accessToken },
      });
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  async logout(req: Request, res: Response) {
    req.log.info(
      { cookies: req.cookies, userId: req.userId },
      "Received request to logout",
    );
    const { userId } = req;
    if (!userId) return responseUtils.error(res, 401, "unauthenticated!");
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return responseUtils.error(res, 400, "refresh token is required!");
    const device = req.headers["user-agent"] ?? "unknown";
    log.info({ userId, device }, "Attempting to log out user");
    try {
      await authService.logout(refreshToken, userId, device);
      res.clearCookie("refreshToken");
      log.info({ userId }, "User logged out successfully");
      return responseUtils.success(res, 200, "user logged out successfully");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  async me(req: Request, res: Response) {
    req.log.info(
      { userId: req.userId },
      "Received request to get authenticated user info",
    );
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    try {
      const dto = await userService.findByIdExcPass(userId);
      log.info({ userData: dto }, "Authenticated user data retrieved");
      return responseUtils.success(
        res,
        200,
        "user authenticate successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  async refreshToken(req: Request, res: Response) {
    req.log.info(
      { cookies: req.cookies, userId: req.userId },
      "Received request to refresh token",
    );
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return responseUtils.error(res, 400, "refresh token is required!");
    const device = req.headers["user-agent"] ?? "unknown";
    // get refresh token in store
    const storedToken = await authService.getRefreshToken(refreshToken, device);
    if (!storedToken) {
      res.clearCookie("refreshToken");
      return responseUtils.error(
        res,
        404,
        "refresh token not found! or different device",
      );
    }
    log.info({ storedToken }, "Stored refresh token retrieved for validation");
    const now = Math.floor(Date.now() / 1000); // date in unix

    if (storedToken.expiredAt < now) {
      authService.revokedRefreshToken(refreshToken);
      res.clearCookie("refreshToken");
      log.warn({ storedToken }, "Refresh token has expired and is revoked");
      return responseUtils.error(
        res,
        401,
        "unauthorized!, refresh token is expired!",
      );
    }
    // verify refresh token is revoked
    try {
      authService.verifyRefreshToken(refreshToken);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        authService.revokedRefreshToken(refreshToken);
        res.clearCookie("refreshToken");
        log.warn({ refreshToken }, "Refresh token has expired and is revoked");
        return responseUtils.error(res, 401, "refresh token expired!");
      }
      return catchAllErrors(res, err);
    }

    try {
      const findUser = await userService.findByIdExcPass(storedToken.userId);
      if (!findUser) {
        res.clearCookie("refreshToken");
        log.warn(
          { userId: storedToken.userId },
          "User not found for refresh token",
        );
        return responseUtils.error(res, 404, "user not found!");
      }

      const newAccessToken = authService.createAccessToken(
        findUser.id,
        findUser.role,
      );
      log.info(
        { userId: findUser.id },
        "New access token generated successfully",
      );
      return responseUtils.success(
        res,
        200,
        "access token generated successfully!",
        { accessToken: newAccessToken },
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default authController;
