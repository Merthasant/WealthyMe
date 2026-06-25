import "dotenv/config";
import { catchAllErrors } from "@/lib/utils/error.utils";
import jwtUtils from "@/lib/utils/jwt.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import authService from "./auth.service";
import userService from "../user/user.service";
import { LoginDTO, RegisterDTO } from "@/lib/types/auth.type";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

const authController = {
  setRefreshTokenInCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: jwtUtils.refreshExpiresInMiliSeconds,
    });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.validatedBody as LoginDTO;
    if (!email || !password)
      return responseUtils.error(res, 400, "email or password is required!");
    const device = req.headers["user-agent"] ?? "unknown";
    try {
      const loginData = await authService.login(email, password);
      const { token, ...data } = loginData;
      const { accessToken, refreshToken } = token;
      authController.setRefreshTokenInCookie(res, refreshToken);
      authService.addRefreshToken(refreshToken, data.id, device);
      return responseUtils.success(res, 200, "user login successfully", {
        ...data,
        token: { accessToken },
      });
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  async register(req: Request, res: Response) {
    const { name, email, password, confPassword, role } =
      req.validatedBody as RegisterDTO;
    if (!name || !email || !password || !confPassword || !role)
      return responseUtils.error(res, 400, "email or password is required!");
    const device = req.headers["user-agent"] ?? "unknown";
    try {
      const registerData = await authService.register({
        name,
        email,
        password,
        confPassword,
        role,
      });
      const { token, ...data } = registerData;
      const { accessToken, refreshToken } = token;
      authController.setRefreshTokenInCookie(res, refreshToken);
      authService.addRefreshToken(refreshToken, data.id, device);
      return responseUtils.success(res, 200, "user register successfully", {
        ...data,
        token: { accessToken },
      });
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  async logout(req: Request, res: Response) {
    const { userId } = req;
    if (!userId) return responseUtils.error(res, 401, "unauthenticated!");
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return responseUtils.error(res, 400, "refresh token is required!");
    const device = req.headers["user-agent"] ?? "unknowm";
    try {
      await authService.logout(refreshToken, userId, device);
      res.clearCookie("refreshToken");
      return responseUtils.success(res, 200, "user logged out successfully");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  async me(req: Request, res: Response) {
    const userId = req.userId;
    console.log("userId", userId);
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    try {
      const dto = await userService.findByIdExcPass(userId);
      const { role: userRole, ...dataUserWithoutRole } = dto;
      const role = userRole?.name;
      if (!role)
        return responseUtils.error(res, 404, "this user does not have a role!");
      return responseUtils.success(
        res,
        200,
        "user authenticate successfully!",
        { role, ...dataUserWithoutRole },
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return responseUtils.error(res, 400, "refresh token is required!");
    const device = req.headers["user-agent"] ?? "unknown";
    // get refresh token in store
    const storedToken = await authService.getRefreshTokenByToken(
      refreshToken,
      device,
    );
    if (!storedToken) {
      res.clearCookie("refreshToken");
      return responseUtils.error(
        res,
        404,
        "refresh token not found! or different device",
      );
    }
    const now = Math.floor(Date.now() / 1000); // date in unix

    if (storedToken.expiredAt < now) {
      authService.revokedRefreshToken(refreshToken);
      res.clearCookie("refreshToken");
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
        return responseUtils.error(res, 401, "refresh token expired!");
      }
      return catchAllErrors(res, err);
    }

    try {
      const findUser = await userService.findByIdExcPass(storedToken.userId);
      if (!findUser) {
        res.clearCookie("refreshToken");
        return responseUtils.error(res, 404, "user not found!");
      }
      const role = findUser.role?.name;
      if (!role) {
        res.clearCookie("refreshToken");
        return responseUtils.error(res, 404, "user role not found!");
      }

      const newAccessToken = authService.createAccessToken(findUser.id, role);
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
