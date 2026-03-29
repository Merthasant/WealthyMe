import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import accountService from "./account.service";
import requestUtils from "@/lib/utils/request.utils";
import { CreateAccountDTO, UpdateAccountDTO } from "@/lib/types/account.type";

const accountController = {
  // get one account
  async getOneAccount(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const accountData = await accountService.findById(id.toString());
      if (!accountData)
        return responseUtils.error(res, 404, "account not found!");
      return responseUtils.success(
        res,
        200,
        "account founded successfully!",
        accountData,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // get all account
  async getAllAccount(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    const OptionParam = requestUtils.getAccountOptionQuery(req);
    try {
      const getAccountData = await accountService.findAll(OptionParam, userId);
      return responseUtils.success(
        res,
        200,
        "all account found successfully",
        getAccountData.data,
        null,
        getAccountData.meta,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // create account
  async createAccount(req: Request, res: Response) {
    const { name, type, balance = 0 }: CreateAccountDTO = req.body;
    if (!name || !type)
      return responseUtils.error(
        res,
        400,
        "name and account type is required!",
      );
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    try {
      await accountService.create({ name, type, balance }, userId);
      return responseUtils.success(res, 201, "account created successfully!");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // update account
  async updateAccount(req: Request, res: Response) {
    const { name, type, balance }: UpdateAccountDTO = req.body;
    if (!name && !type && !balance)
      return responseUtils.error(res, 400, "one data must be required!");
    const id = req.params.id;
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      await accountService.updateById(
        { name, type, balance },
        userId,
        id.toString(),
      );
      return responseUtils.success(res, 200, "account updated successfully!");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete account
  async deleteAccount(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      await accountService.deleteById(userId, id.toString());
      return responseUtils.success(res, 200, "account deleted successfully!");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default accountController;
