import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import transactionService from "./transaction.service";
import requestUtils from "@/lib/utils/request.utils";
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "@/lib/types/transaction.type";

const transactionController = {
  // get one transaction
  async getOneTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      requestUtils.getTransactionIdQuery(req);
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
      const transactionData = await transactionService.findById(
        id.toString(),
        accountId,
        userId,
      );
      if (!transactionData)
        return responseUtils.error(res, 404, "transaction not found!");
      return responseUtils.success(
        res,
        200,
        "transaction founded successfully",
        transactionData,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // get transaction data table
  async getTransactionDataTable(req: Request, res: Response) {
    const { accountId } = requestUtils.getTransactionIdQuery(req);
    if (!accountId)
      return responseUtils.error(res, 400, "account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    const { page, limit, search, sortBy, sortOrder, type, from_date, to_date } =
      requestUtils.getTransactionOptionQuery(req);
    try {
      const transactionData = await transactionService.findAllForDataTable(
        { page, limit, search, sortBy, sortOrder, type, from_date, to_date },
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transactions founded successfully!",
        transactionData.data,
        null,
        transactionData.meta,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // get transaction chart
  async getTransactionChart(req: Request, res: Response) {
    const { accountId } = requestUtils.getTransactionIdQuery(req);
    if (!accountId)
      return responseUtils.error(res, 400, "account id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    const { from_date, to_date } = requestUtils.getTransactionOptionQuery(req);
    try {
      const transactionData = await transactionService.findAllForChart(
        { from_date, to_date },
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "transactions for chart founded successfully!",
        transactionData,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // create transaction
  async createTransaction(req: Request, res: Response) {
    const { accountId } = requestUtils.getTransactionIdQuery(req);
    if (!accountId)
      return responseUtils.error(res, 400, "account id is required!");
    const {
      amount,
      categoryId,
      transactionAt,
      type,
      currency_code,
      note,
      receiptUrl,
    }: CreateTransactionDTO = req.body;

    if (!amount || !categoryId || !transactionAt || !type || !currency_code)
      return responseUtils.error(res, 400, "all data required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    try {
      await transactionService.create(
        {
          amount,
          categoryId,
          deletedAt: null,
          transactionAt,
          currency_code,
          type,
          note,
          receiptUrl,
        },
        accountId,
        userId,
      );
      return responseUtils.success(
        res,
        201,
        "transaction created successfully!",
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // update transaction
  async updateTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      requestUtils.getTransactionIdQuery(req);
    if (!accountId || !id)
      return responseUtils.error(res, 400, "id and account id is required!");

    const {
      amount,
      categoryId,
      note,
      currency_code,
      receiptUrl,
      transactionAt,
      type,
    }: UpdateTransactionDTO = req.body;

    if (
      !amount &&
      !categoryId &&
      !note &&
      !receiptUrl &&
      !transactionAt &&
      !type &&
      !currency_code
    )
      return responseUtils.error(res, 400, "one data must be required!");

    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required, unauthorized!",
      );
    try {
      await transactionService.updateById(
        {
          amount,
          categoryId,
          note,
          receiptUrl,
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
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete transaction
  async deleteTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      requestUtils.getTransactionIdQuery(req);
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
      await transactionService.deleteById(id, accountId, userId);
      return responseUtils.success(
        res,
        200,
        "transaction deleted successfully!",
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // restore transaction
  async restoreTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      requestUtils.getTransactionIdQuery(req);
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
      await transactionService.restoreTransactionById(id, accountId, userId);
      return responseUtils.success(
        res,
        200,
        "transaction restored successfully!",
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete permanent transaction
  async deletePermanentTransaction(req: Request, res: Response) {
    const { accountId, transactionId: id } =
      requestUtils.getTransactionIdQuery(req);
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
      await transactionService.deletePermanentById(id, accountId, userId);
      return responseUtils.success(
        res,
        200,
        "transaction deleted permanent successfully!",
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default transactionController;
