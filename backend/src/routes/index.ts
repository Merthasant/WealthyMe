import express from "express";
import userRouter from "@/modules/user/user.route.js";
import authRouter from "@/modules/auth/auth.route.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;
