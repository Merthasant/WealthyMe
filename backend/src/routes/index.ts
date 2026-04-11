import express from "express";
import userRouter from "@/modules/user/user.route.js";
import authRouter from "@/modules/auth/auth.route.js";
import accountRouter from "@/modules/account/account.route.js";
import profileRouter from "@/modules/profile/profile.route.js";
import categoryRouter from "@/modules/category/category.route.js";
import transactionRouter from "@/modules/transaction/transaction.route.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/account", accountRouter);
router.use("/profile", profileRouter);
router.use("/category", categoryRouter);
router.use("/transaction", transactionRouter);

export default router;
