import { AuthRequest } from "@/lib/types/auth.type";
import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import authService from "@/modules/auth/auth.service";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const accessMiddleware = {
  // verify user
  async verifyUser(req: AuthRequest, res: Response, next: NextFunction) {
    // authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) return responseUtils.error(res, 401, "unauthenticated!");
    // get access token
    if (!authHeader.startsWith("bearer"))
      return responseUtils.error(res, 400, "invalid token format!");
    const accessToken = authHeader.split(" ")[1];
    // get refresh token
    const { refreshToken } = req.cookies;
    if (!refreshToken) return responseUtils.error(res, 401, "unauthenticated!");
    let refreshDecoded: jwt.JwtPayload;

    // verify refresh token
    try {
      refreshDecoded = authService.verifyRefreshToken(
        refreshToken,
      ) as jwt.JwtPayload;
    } catch (err) {
      res.clearCookie("refreshToken");
      return responseUtils.error(res, 401, "refresh token is expired!");
    }

    // get refresh token in store
    const storedToken = await authService.getRefreshTokenByToken(refreshToken);
    if (!storedToken) {
      res.clearCookie("refreshToken");
      return responseUtils.error(res, 404, "refresh token not found!");
    }

    if (storedToken.isRevoked) {
      res.clearCookie("refreshToken");
      return responseUtils.error(res, 401, "unauthorized!");
    }

    if (storedToken.expiredAt < new Date()) {
      authService.revokedRefreshToken(refreshToken);
      res.clearCookie("refreshToken");
      return responseUtils.error(
        res,
        401,
        "unauthorized!, refresh token is expired!",
      );
    }

    // verify access token
    try {
      const accessDecoded = authService.verifyAccessToken(
        accessToken,
      ) as jwt.JwtPayload;
      req.userId = accessDecoded.userId;
      req.role = accessDecoded.role;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const newAccessToken = authService.createAccessToken(
          refreshDecoded.userId,
          refreshDecoded.role,
        );
        if (!newAccessToken)
          return responseUtils.error(res, 500, "failed to generate token!");
        res.setHeader("x-new-access-token", `Bearer ${newAccessToken}`);
        req.userId = refreshDecoded.userId;
        req.role = refreshDecoded.role;
        return next();
      }
      return catchAllErrors(res, err);
    }
    next();
  },
  async isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    const role = req.role;
    if (!role) return responseUtils.error(res, 400, "role is required!");
    try {
      if (role !== "admin")
        return responseUtils.error(res, 403, "access denied!");
    } catch (err) {
      return catchAllErrors(res, err);
    }
    next();
  },
};

export default accessMiddleware;
