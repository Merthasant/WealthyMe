import express from "express";
import userRouter from "@/modules/user/user.route.js";
import authRouter from "@/modules/auth/auth.route.js";
import accountRouter from "@/modules/account/account.route.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/account", accountRouter);

export default router;
