import accessMiddleware from "@/middlewares/access.middleware.js";
import express from "express";
import accountController from "./account.controller.js";
import validationMiddleware from "@/middlewares/validation.middleware.js";
import {
  createAccountSchema,
  updateAccountSchema,
} from "@/lib/types/account.type.js";
import { accountOptionSchema } from "@/lib/types/params.type.js";

const router = express.Router();

router.post(
  "/",
  accessMiddleware.verifyUser,
  validationMiddleware.validateBody(createAccountSchema),
  accountController.createAccount,
);
router.get(
  "/:id",
  accessMiddleware.verifyUser,
  accountController.getOneAccount,
);
router.get(
  "/",
  accessMiddleware.verifyUser,
  validationMiddleware.validateQuery(accountOptionSchema),
  accountController.getAllAccount,
);
router.patch(
  "/:id",
  accessMiddleware.verifyUser,
  validationMiddleware.validateBody(updateAccountSchema),
  accountController.updateAccount,
);
router.delete(
  "/:id",
  accessMiddleware.verifyUser,
  accountController.deleteAccount,
);

export default router;
