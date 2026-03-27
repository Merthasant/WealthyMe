import express from "express";
import authController from "./auth.controller";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout); //error harus ada middelware
router.get("/me", authController.me); // error harus ada middleware

export default router;
