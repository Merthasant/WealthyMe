import { catchAllErrors } from "@/lib/utils/error.utils";
import { createLogger } from "@/lib/utils/log.utils";
import responseUtils from "@/lib/utils/response.utils";
import authService from "@/modules/auth/auth.service";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

const log = createLogger({ service: "access-middleware" });

const accessMiddleware = {
  // verify user
  async verifyUser(req: Request, res: Response, next: NextFunction) {
    req.log.info(
      { headers: req.headers, cookies: req.cookies },
      "Received request to verify user",
    );
    // authentication
    const authHeader = req.headers.authorization;
    log.info({ authHeader }, "Authorization header received");
    if (!authHeader) return responseUtils.error(res, 401, "unauthenticated!");
    // get access token
    if (!authHeader.startsWith("Bearer"))
      return responseUtils.error(res, 400, "invalid token format!");
    const accessToken = authHeader.split(" ")[1];
    log.info({ accessToken }, "Access token extracted from header");
    // get refresh token
    const { refreshToken } = req.cookies;
    if (!refreshToken) return responseUtils.error(res, 401, "unauthenticated!");
    log.info({ refreshToken }, "Refresh token retrieved from cookies");
    let refreshDecoded;

    // get device
    const device = req.headers["user-agent"] ?? "unknown";
    log.info({ device }, "Device information retrieved from headers");

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
    const storedToken = await authService.getRefreshToken(refreshToken, device);
    if (!storedToken) {
      res.clearCookie("refreshToken");
      return responseUtils.error(res, 404, "refresh token not found!");
    }

    log.info({ storedToken }, "Stored refresh token retrieved for validation");

    if (storedToken.isRevoked) {
      res.clearCookie("refreshToken");
      return responseUtils.error(res, 401, "unauthorized!");
    }

    const now = Math.floor(Date.now()); // date in unix tanpa dibagi 1000

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

    // verify access token
    try {
      const accessDecoded = authService.verifyAccessToken(
        accessToken,
      ) as jwt.JwtPayload;
      req.userId = accessDecoded.id;
      req.role = accessDecoded.role;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const newAccessToken = authService.createAccessToken(
          refreshDecoded.id,
          refreshDecoded.role,
        );
        log.info(
          { userId: refreshDecoded.id, role: refreshDecoded.role },
          "Creating new access token using refresh token",
        );
        if (!newAccessToken)
          return responseUtils.error(res, 500, "failed to generate token!");
        res.setHeader("x-new-access-token", `Bearer ${newAccessToken}`);
        req.userId = refreshDecoded.id;
        req.role = refreshDecoded.role;
        return next();
      }
      return catchAllErrors(res, err);
    }
    next();
  },
  async isAdmin(req: Request, res: Response, next: NextFunction) {
    req.log.info(
      { userId: req.userId, role: req.role },
      "Checking if user has admin access",
    );
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
