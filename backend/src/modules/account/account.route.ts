import accessMiddleware from "@/middlewares/access.middleware.js";
import express from "express";
import accountController from "./account.controller.js";

const router = express.Router();

router.post("/", accessMiddleware.verifyUser, accountController.createAccount);
router.get(
  "/:id",
  accessMiddleware.verifyUser,
  accountController.getOneAccount,
);
router.get("/", accessMiddleware.verifyUser, accountController.getAllAccount);
router.patch(
  "/:id",
  accessMiddleware.verifyUser,
  accountController.updateAccount,
);
router.delete(
  "/:id",
  accessMiddleware.verifyUser,
  accountController.deleteAccount,
);

export default router;
