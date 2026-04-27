import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import transactionService from "./transaction.service";
import {
  TransactionIdQuery,
  TransactionOptionParams,
} from "@/lib/types/params.type";
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "@/lib/types/transaction.type";

const transactionController = {
  // get one transaction
  async getOneTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      req.validatedQuery as TransactionIdQuery;
    if (!accountId || !id)
      return responseUtils.error(res, 400, "id and account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    try {
      const dto = await transactionService.findById(
        id.toString(),
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transaction founded successfully",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // get transaction data table
  async getTransactionDataTable(req: Request, res: Response) {
    const { accountId } = req.validatedQuery as TransactionIdQuery;
    if (!accountId)
      return responseUtils.error(res, 400, "account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    const transactionDataTableOptions =
      req.validatedQuery as TransactionOptionParams;
    try {
      const dto = await transactionService.findAllForDataTable(
        transactionDataTableOptions,
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transactions founded successfully!",
        dto.data,
        null,
        dto.meta,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // get transaction chart
  async getTransactionChart(req: Request, res: Response) {
    const { accountId } = req.validatedQuery as TransactionIdQuery;
    if (!accountId)
      return responseUtils.error(res, 400, "account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    const transactionChartOptions =
      req.validatedQuery as TransactionOptionParams;
    try {
      const dto = await transactionService.findAllForChart(
        transactionChartOptions,
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transactions for chart founded successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // create transaction
  async createTransaction(req: Request, res: Response) {
    const { accountId } = req.validatedQuery as TransactionIdQuery;
    if (!accountId)
      return responseUtils.error(res, 400, "account id is required!");
    const { amount, categoryId, type, currency_code, note, transactionAt } =
      req.validatedBody as CreateTransactionDTO;

    if (!amount || !categoryId || !transactionAt || !type || !currency_code)
      return responseUtils.error(res, 400, "all data required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    const file = req.file;
    try {
      const { receiptUrl, receiptPublicId } =
        await transactionService.uploadReceipt(file);
      const dto = await transactionService.create(
        {
          amount,
          categoryId,
          transactionAt,
          currency_code,
          type,
          note,
          receiptUrl,
          receiptPublicId,
        },
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        201,
        "transaction created successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // update transaction
  async updateTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      req.validatedQuery as TransactionIdQuery;
    if (!accountId || !id)
      return responseUtils.error(res, 400, "id and account id is required!");

    if (!req.body) {
      return responseUtils.error(
        res,
        400,
        "at least one data must be required!",
      );
    }

    const { amount, categoryId, note, transactionAt, type, currency_code } =
      req.validatedBody as UpdateTransactionDTO;

    const file = req.file;

    if (
      !amount &&
      !categoryId &&
      !note &&
      !file &&
      !transactionAt &&
      !type &&
      !currency_code
    )
      return responseUtils.error(
        res,
        400,
        "at least one data must be required!",
      );

    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    try {
      if (file) {
        const oldReceipt =
          await transactionService.getReceiptPublicIdByTransactionId(id);
        if (oldReceipt) {
          await transactionService.deleteReceipt(oldReceipt);
        }
      }

      const { receiptUrl, receiptPublicId } =
        await transactionService.uploadReceipt(file);

      const dto = await transactionService.updateById(
        {
          amount,
          categoryId,
          note,
          receiptUrl,
          receiptPublicId,
          currency_code,
          transactionAt,
          type,
        },
        id,
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transaction updated successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete receipt only
  async deleteReceiptOnly(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      req.validatedQuery as TransactionIdQuery;
    if (!accountId || !id)
      return responseUtils.error(res, 400, "id and account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    try {
      const oldReceipt =
        await transactionService.getReceiptPublicIdByTransactionId(id);
      if (!oldReceipt) {
        return responseUtils.error(res, 404, "receipt not found!");
      }
      await transactionService.deleteReceipt(oldReceipt);
      const dto = await transactionService.updateById(
        {
          receiptUrl: undefined,
          receiptPublicId: undefined,
        },
        id,
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "receipt deleted successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete transaction
  async deleteTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      req.validatedQuery as TransactionIdQuery;
    if (!accountId || !id)
      return responseUtils.error(res, 400, "id and account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    try {
      const dto = await transactionService.deleteById(id, accountId, userId);
      return responseUtils.success(
        res,
        200,
        "transaction deleted successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // restore transaction
  async restoreTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      req.validatedQuery as TransactionIdQuery;
    if (!accountId || !id)
      return responseUtils.error(res, 400, "id and account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!, unauthorized!",
      );
    try {
      const dto = await transactionService.restoreTransactionById(
        id,
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transaction restored successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete permanent transaction
  async deletePermanentTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } = req.query as TransactionIdQuery;
    if (!accountId || !id)
      return responseUtils.error(res, 400, "id and account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    try {
      // delete receipt in cloudinary jika exist
      const publicId =
        await transactionService.getReceiptPublicIdByTransactionId(id);
      if (publicId) await transactionService.deleteReceipt(publicId);

      const dto = await transactionService.deletePermanentById(
        id,
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transaction deleted permanent successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default transactionController;
