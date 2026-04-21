import accessMiddleware from "@/middlewares/access.middleware";
import express from "express";
import transactionController from "./transaction.controller";
import { upload } from "@/middlewares/multer.middleware";

const router = express.Router();

router.get(
  "/",
  accessMiddleware.verifyUser,
  transactionController.getOneTransaction,
);
router.get(
  "/datatable",
  accessMiddleware.verifyUser,
  transactionController.getTransactionDataTable,
);
router.get(
  "/chart",
  accessMiddleware.verifyUser,
  transactionController.getTransactionChart,
);
router.post(
  "/",
  accessMiddleware.verifyUser,
  upload.single("receipt"),
  transactionController.createTransaction,
);
router.patch(
  "/update",
  accessMiddleware.verifyUser,
  upload.single("receipt"),
  transactionController.updateTransaction,
);
router.patch(
  "/delete",
  accessMiddleware.verifyUser,
  transactionController.deleteTransaction,
);
router.patch(
  "/restore",
  accessMiddleware.verifyUser,
  transactionController.restoreTransaction,
);
router.delete(
  "/",
  accessMiddleware.verifyUser,
  transactionController.deletePermanentTransaction,
);

export default router;
