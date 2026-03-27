import express from "express";
import authController from "./auth.controller.js";
import accessMiddleware from "@/middlewares/access.middleware.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", accessMiddleware.verifyUser, authController.logout);
router.get("/me", accessMiddleware.verifyUser, authController.me);

export default router;
