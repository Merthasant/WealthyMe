import express from "express";
import authController from "./auth.controller";
import accessMiddleware from "@/middlewares/access.middleware";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", accessMiddleware.verifyUser, authController.logout); //error ternyata bukan harus ada middelware
router.get("/me", accessMiddleware.verifyUser, authController.me); // error ternyata bukan harus harus ada middleware

export default router;
