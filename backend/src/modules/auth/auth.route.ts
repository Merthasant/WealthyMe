import express from "express";
import authController from "./auth.controller.js";
import accessMiddleware from "@/middlewares/access.middleware.js";
import validationMiddleware from "@/middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "@/lib/types/auth.type.js";

const router = express.Router();

router.post(
  "/login",
  validationMiddleware.validateBody(loginSchema),
  authController.login,
);
router.post(
  "/register",
  validationMiddleware.validateBody(registerSchema),
  authController.register,
);
router.get("/refresh", authController.refreshToken);
router.post("/logout", accessMiddleware.verifyUser, authController.logout);
router.get("/me", accessMiddleware.verifyUser, authController.me);

export default router;
