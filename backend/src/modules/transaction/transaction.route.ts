import accessMiddleware from "@/middlewares/access.middleware";
import express from "express";
import transactionController from "./transaction.controller";
import { upload } from "@/middlewares/multer.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import {
  transactionChartOptionSchema,
  transactionOptionSchema,
} from "@/lib/types/params.type";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/lib/types/transaction.type";

const router = express.Router();

router.get(
  "/",
  accessMiddleware.verifyUser,
  transactionController.getOneTransaction,
);
router.get(
  "/datatable",
  accessMiddleware.verifyUser,
  validationMiddleware.validateQuery(transactionOptionSchema),
  transactionController.getTransactionDataTable,
);
router.get(
  "/chart",
  accessMiddleware.verifyUser,
  validationMiddleware.validateQuery(transactionChartOptionSchema),
  transactionController.getTransactionChart,
);
router.post(
  "/",
  accessMiddleware.verifyUser,
  upload.single("receipt"),
  validationMiddleware.validateBody(createTransactionSchema),
  transactionController.createTransaction,
);
router.patch(
  "/",
  accessMiddleware.verifyUser,
  upload.single("receipt"),
  validationMiddleware.validateBody(updateTransactionSchema),
  transactionController.updateTransaction,
);
router.delete(
  "/receipt",
  accessMiddleware.verifyUser,
  transactionController.deleteReceiptOnly,
);
router.delete(
  "/",
  accessMiddleware.verifyUser,
  transactionController.deleteTransaction,
);
router.patch(
  "/restore",
  accessMiddleware.verifyUser,
  transactionController.restoreTransaction,
);
router.delete(
  "/permanent",
  accessMiddleware.verifyUser,
  transactionController.deletePermanentTransaction,
);

export default router;
